import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router'; // Import useRouter for web navigation
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Orders = () => {
  const route = useRoute();
  const router = useRouter(); // Use useRouter for web navigation

  // Define state variables for order details
  const [itemName, setItemName] = useState('Grapes');
  const [imageUri, setImageUri] = useState('https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&h=350');
  const [price, setPrice] = useState('0.00');
  const [platformFee, setPlatformFee] = useState('0.00');
  const [totalAmount, setTotalAmount] = useState('0.00');
  const [quantity, setQuantity] = useState('1');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Not Selected');
  const [coupon, setCoupon] = useState('');
  const [transportationNeeded, setTransportationNeeded] = useState(false);

  // Function to save order details to AsyncStorage
  const storeOrderDetails = async (orderDetails) => {
    try {
      await AsyncStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    } catch (error) {
      console.log('Error storing order details:', error);
    }
  };

  // Function to retrieve order details from AsyncStorage
  const retrieveOrderDetails = async () => {
    try {
      const savedOrderDetails = await AsyncStorage.getItem('orderDetails');
      return savedOrderDetails ? JSON.parse(savedOrderDetails) : null;
    } catch (error) {
      console.log('Error retrieving order details:', error);
    }
  };

  // Load saved order details on component mount
  useEffect(() => {
    const loadOrderDetails = async () => {
      const storedOrderDetails = await retrieveOrderDetails();
      if (storedOrderDetails) {
        setItemName(storedOrderDetails.itemName);
        setImageUri(storedOrderDetails.imageUri);
        setPrice(storedOrderDetails.price);
        setPlatformFee(storedOrderDetails.platformFee);
        setTotalAmount(storedOrderDetails.totalAmount);
        setQuantity(storedOrderDetails.quantity);
        setLocation(storedOrderDetails.location);
        setPaymentMethod(storedOrderDetails.paymentMethod);
        setCoupon(storedOrderDetails.coupon);
        setTransportationNeeded(storedOrderDetails.transportationNeeded);
      }
    };

    loadOrderDetails();
  }, []);

  // Extract parameters from route.params and update state
  useEffect(() => {
    if (route.params) {
      const {
        itemName = 'Grapes',
        imageUri = 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&h=350',
        price = '0.00',
        platformFee = '0.00',
        totalAmount = '0.00',
        quantity = '1',
        location = '',
        paymentMethod = 'Not Selected',
        coupon = '',
        transportationNeeded = 'false',
      } = route.params;

      // Set state from route parameters
      setItemName(itemName);
      setImageUri(imageUri);
      setPrice(price);
      setPlatformFee(platformFee);
      setTotalAmount(totalAmount);
      setQuantity(quantity);
      setLocation(location);
      setPaymentMethod(paymentMethod);
      setCoupon(coupon);
      setTransportationNeeded(transportationNeeded === 'true');

      // Log the extracted order details correctly
      console.log('Extracted Order Details:', {
        itemName,
        imageUri,
        price,
        platformFee,
        totalAmount,
        quantity,
        location,
        paymentMethod,
        coupon,
        transportationNeeded,
      });

      // Store the extracted order details in AsyncStorage
      storeOrderDetails({
        itemName,
        imageUri,
        price,
        platformFee,
        totalAmount,
        quantity,
        location,
        paymentMethod,
        coupon,
        transportationNeeded: transportationNeeded === 'true',
      });
    }
  }, [route.params]);

  // Check if necessary data is present
  const isOrderDataPresent = itemName && imageUri && price && platformFee && totalAmount && quantity && paymentMethod;

  return (
    <View style={tw`flex-1 bg-green-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View style={tw`p-4 mb-4`}>
          <View style={tw`flex-row items-center mb-4`}>
            <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
              <FontAwesome5 name="arrow-left" size={24} color="green" />
              <Text style={tw`text-xl font-bold text-green-700 ml-2`}>Orders</Text>
            </TouchableOpacity>
          </View>

          {/* Display order details if present */}
          {isOrderDataPresent ? (
            <View style={tw`flex-row items-center bg-white rounded-lg shadow p-4 mb-4`}>
              <Image source={{ uri: imageUri }} style={tw`w-16 h-16 rounded-lg`} />
              <View style={tw`flex-1 ml-4`}>
                <Text style={tw`text-lg font-bold`}>{itemName}</Text>
                <Text style={tw`text-lg`}>Price: ₹{price}</Text>
                <Text style={tw`text-lg`}>Platform Fee: ₹{platformFee}</Text>
                <Text style={tw`text-lg text-red-600`}>Total: ₹{totalAmount}</Text>
                <Text style={tw`text-lg`}>Quantity: {quantity}</Text>
                {location ? <Text style={tw`text-lg`}>Location: {location}</Text> : null}
                <Text style={tw`text-lg`}>Payment Method: {paymentMethod}</Text>
                <Text style={tw`text-lg`}>Coupon Code: {coupon || 'None'}</Text>
                <Text style={tw`text-lg`}>Transportation Needed: {transportationNeeded ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          ) : (
            <Text style={tw`text-lg text-red-600`}>No order details available.</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={tw`flex-row justify-around p-4 bg-white border-t border-gray-200`}>
        <TouchableOpacity onPress={() => router.push('/screens/Home')} style={tw`items-center`}>
          <FontAwesome5 name="home" size={24} color="green" />
          <Text style={tw`text-sm text-gray-700 mt-1`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Orders')} style={tw`items-center`}>
          <FontAwesome5 name="box" size={24} color="gray" />
          <Text style={tw`text-sm text-gray-700 mt-1`}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Cart')} style={tw`items-center`}>
          <FontAwesome5 name="shopping-cart" size={24} color="gray" />
          <Text style={tw`text-sm text-gray-700 mt-1`}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={tw`items-center`}>
          <MaterialIcons name="person" size={24} color="gray" />
          <Text style={tw`text-sm text-gray-700 mt-1`}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Orders;
