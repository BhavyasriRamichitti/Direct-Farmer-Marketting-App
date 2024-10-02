from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load and preprocess dataset
df = pd.read_csv('crop_yield.csv')
df['Season'] = df['Season'].str.strip()

# Encode categorical variables
le_season = LabelEncoder()
le_state = LabelEncoder()

df['Season_encoded'] = le_season.fit_transform(df['Season'])
df['State_encoded'] = le_state.fit_transform(df['State'])

# Define features and target variable
X = df[['Season_encoded', 'State_encoded']]
y = df['Crop']

# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a RandomForestClassifier with fixed hyperparameters
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42
)

# Fit the model
model.fit(X_train, y_train)

# Predict on the test set and calculate accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy}")

# Define the predict route
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    season_input = data['season']
    state_input = data['state']

    # Encode inputs
    season_encoded = le_season.transform([season_input])[0]
    state_encoded = le_state.transform([state_input])[0]

    # Create a DataFrame for the input data
    input_data = pd.DataFrame({'Season_encoded': [season_encoded], 'State_encoded': [state_encoded]})

    # Predict the crop
    predicted_crop = model.predict(input_data)[0]

    # Return the predicted crop as JSON response
    return jsonify({'predicted_crop': predicted_crop})

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
