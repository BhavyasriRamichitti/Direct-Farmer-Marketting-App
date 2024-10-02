import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const OrderTracking = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState({ latitude: 37.79825, longitude: -122.4524 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setOrigin({ latitude, longitude });
    };

    getLocation().catch((err) => {
      setError(err.message);
      Alert.alert('Error', err.message);
    });
  }, []);

  return (
    <View style={styles.container}>
      {origin ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={origin} title="Your Location" />
          <Marker coordinate={destination} title="Destination" />
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyDhS1BTP3GV_B3Mv2KP5x5eqdsEDcnLi2k"
            strokeWidth={3}
            strokeColor="hotpink"
          />
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Text>Order Tracking</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default OrderTracking;
