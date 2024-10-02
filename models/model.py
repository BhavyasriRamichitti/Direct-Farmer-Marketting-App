from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

app = Flask(__name__)
CORS(app)

# Load the data from an XLS file
def load_data():
    data = pd.read_html('Agmarknet_Price_Report.xls')  # Replace with your local .xls file
    data['Price Date'] = pd.to_datetime(data['Price Date'], format='%d %b %Y')
    data['YearMonth'] = data['Price Date'].dt.to_period('M')
    data['Commodity'] = data['Commodity'].fillna('Unknown')

    Q1 = data['Max Price (Rs./Quintal)'].quantile(0.25)
    Q3 = data['Max Price (Rs./Quintal)'].quantile(0.75)
    IQR = Q3 - Q1
    Upper_cap = Q3 + 1.5 * IQR
    Lower_cap = Q1 - 1.5 * IQR
    data['Max Price (Rs./Quintal)'] = np.clip(data['Max Price (Rs./Quintal)'], Lower_cap, Upper_cap)
    
    monthly_avg_price = data.groupby(['YearMonth', 'Commodity'])['Max Price (Rs./Quintal)'].mean().reset_index()
    monthly_avg_price['YearMonth'] = monthly_avg_price['YearMonth'].astype(str)
    monthly_avg_price['YearMonth'] = pd.to_datetime(monthly_avg_price['YearMonth'], format='%Y-%m')
    monthly_avg_price['DateOrdinal'] = monthly_avg_price['YearMonth'].apply(lambda date: date.toordinal())
    
    return monthly_avg_price

monthly_avg_price = load_data()

poly = PolynomialFeatures(degree=2)
scaler = StandardScaler()

def predict_future_prices(model, scaler, poly, last_date, num_months=12):
    future_dates = [last_date + timedelta(days=30 * i) for i in range(1, num_months + 1)]
    future_ordinals = np.array([date.toordinal() for date in future_dates]).reshape(-1, 1)
    future_poly = poly.transform(future_ordinals)
    future_scaled = scaler.transform(future_poly)
    future_predictions = model.predict(future_scaled)
    return future_dates, future_predictions

def continuous_prediction(data_commodity):
    X = data_commodity[['DateOrdinal']]
    y = data_commodity['Max Price (Rs./Quintal)']
    
    X_poly = poly.fit_transform(X)
    X_poly_scaled = scaler.fit_transform(X_poly)
    
    model = LinearRegression()
    model.fit(X_poly_scaled, y)
    
    y_pred_train = model.predict(X_poly_scaled)
    mse = mean_squared_error(y, y_pred_train)
    r2 = r2_score(y, y_pred_train)

    last_date = data_commodity['YearMonth'].max()
    future_dates, future_predictions = predict_future_prices(model, scaler, poly, last_date, num_months=12)

    future_df = pd.DataFrame({
        'YearMonth': future_dates,
        'Commodity': data_commodity['Commodity'].iloc[0],
        'Max Price (Rs./Quintal)': future_predictions,
        'DateOrdinal': [date.toordinal() for date in future_dates]
    })

    data_commodity = pd.concat([data_commodity, future_df], ignore_index=True)
    
    return data_commodity, mse, r2

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    crop = data.get('crop')
    year = data.get('year')
    
    data_commodity = monthly_avg_price[monthly_avg_price['Commodity'] == crop]
    data_commodity, mse, r2 = continuous_prediction(data_commodity)
    
    predictions = data_commodity[['YearMonth', 'Max Price (Rs./Quintal)']].tail(12).to_dict(orient='records')
    
    return jsonify({'predictions': predictions, 'mse': mse, 'r2': r2})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
