import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

const CropPredictionScreen = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    try {
      // Automatically request prediction data for a specific crop and year (you can hardcode crop and year)
      const response = await axios.post('http://192.168.10.39:5001/predict', {
        crop: 'wheat', // Example crop
        year: '2024'   // Example year
      });
      setPredictions(response.data.predictions);
      setError(null); // Clear any previous error
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching predictions');
    }
  };

  // Automatically fetch predictions when the component mounts
  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Crop Price Prediction Trends</Text>

        {error && (
          <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>
        )}

        {predictions.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <VictoryChart width={Dimensions.get('window').width - 40}>
              <VictoryAxis
                tickFormat={(tick) => new Date(tick).toLocaleDateString()}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => `Rs ${tick}`}
              />
              <VictoryLine
                data={predictions}
                x="YearMonth"
                y="Max Price (Rs./Quintal)"
                style={{ data: { stroke: '#c43a31' } }}
              />
            </VictoryChart>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CropPredictionScreen;
