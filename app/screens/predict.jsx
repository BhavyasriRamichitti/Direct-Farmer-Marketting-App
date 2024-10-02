import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PredictionScreen = () => {
  const [season, setSeason] = useState('');
  const [state, setState] = useState('');
  const [predictedCrop, setPredictedCrop] = useState('');

  const handlePredictCrop = async () => {
    if (!season || !state) {
      Alert.alert('Error', 'Please enter both season and state');
      return;
    }

    try {
      const response = await axios.post('http://192.168.10.39:5000/predict', {
        season: season,
        state: state
      });
      
      setPredictedCrop(response.data.predicted_crop);
    } catch (error) {
      console.error('Error predicting crop:', error);
      Alert.alert('Error', 'Could not fetch prediction from the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Prediction</Text>

      <Text style={styles.label}>Enter Season</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Kharif"
        value={season}
        onChangeText={setSeason}
      />

      <Text style={styles.label}>Enter State</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Karnataka"
        value={state}
        onChangeText={setState}
      />

      <TouchableOpacity style={styles.button} onPress={handlePredictCrop}>
        <Text style={styles.buttonText}>Predict Crop</Text>
      </TouchableOpacity>

      {predictedCrop ? (
        <Text style={styles.resultText}>
          Predicted Crop: <Text style={styles.predictedCrop}>{predictedCrop}</Text>
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  predictedCrop: {
    fontWeight: 'bold',
    color: '#ff5722',
  },
});

export default PredictionScreen;
