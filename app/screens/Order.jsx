import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Add this import

const Order = () => {
  const route = useRoute();
  const router = useRouter();

  const itemName = route.params?.itemName || 'Default Item';
  const imageUri = route.params?.imageUri || 'https://via.placeholder.com/100';

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [platformFee, setPlatformFee] = useState(5);
  const [totalAmount, setTotalAmount] = useState('');
  const [transportationNeeded, setTransportationNeeded] = useState(false);
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [coupon, setCoupon] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  const ratePerUnit = 30;

  // Calculate price and total amount based on quantity and platform fee
  useEffect(() => {
    const calculatedPrice = quantity * ratePerUnit;
    setPrice(calculatedPrice.toFixed(2));
    const total = calculatedPrice + platformFee;
    setTotalAmount(total.toFixed(2));
  }, [quantity, platformFee]);

  // Function to store order details in AsyncStorage
  const storeOrderDetails = async (orderDetails) => {
    try {
      const jsonValue = JSON.stringify(orderDetails);
      await AsyncStorage.setItem('orderDetails', jsonValue);
      console.log('Order details stored successfully.');
    } catch (e) {
      console.error('Failed to save order details:', e);
    }
  };

  const handleSubmit = () => {
    if (!price || !paymentMethod) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const orderDetails = {
      itemName,
      imageUri,
      price,
      platformFee,
      totalAmount,
      quantity,
      transportationNeeded,
      location: location || '',
      paymentMethod,
      coupon,
    };

    // Log all the order details to the console
    console.log(orderDetails);

    // Store order details in AsyncStorage
    storeOrderDetails(orderDetails);

    // Navigate to Orders page and pass order details
    router.push({
      pathname: '/screens/Orders',
      params: orderDetails,
    });

    // Clear fields after submission
    setQuantity(1);
    setPrice('');
    setTransportationNeeded(false);
    setLocation('');
    setPaymentMethod('');
    setCoupon('');
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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

          {/* Display image, item name, and quantity selectors */}
          <View style={tw`flex-row items-center mb-4`}>
            <Image source={{ uri: imageUri }} style={tw`w-16 h-16 rounded-lg`} />
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-xl font-bold`}>{itemName}</Text>
              <View style={tw`flex-row items-center mt-2`}>
                <TouchableOpacity onPress={decreaseQuantity} style={tw`bg-gray-200 p-2 rounded-lg`}>
                  <Entypo name="minus" size={20} color="black" />
                </TouchableOpacity>
                <Text style={tw`mx-4 text-lg`}>{quantity}</Text>
                <TouchableOpacity onPress={increaseQuantity} style={tw`bg-gray-200 p-2 rounded-lg`}>
                  <Entypo name="plus" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={tw`text-lg font-bold mb-2`}>Coupon Code</Text>
          <View style={tw`relative`}>
            <TextInput
              style={tw`bg-gray-200 border border-gray-300 rounded p-2 mb-4 pr-10`}
              placeholder="Enter coupon code (if any)"
              value={showCoupon ? coupon : ''}
              onChangeText={setCoupon}
              secureTextEntry={!showCoupon}
            />
            <TouchableOpacity
              style={tw`absolute right-2 top-1/2 transform -translate-y-1/2`}
              onPress={() => setShowCoupon(!showCoupon)}
            >
              <Entypo name={showCoupon ? "eye" : "eye-with-line"} size={24} color={showCoupon ? "gray" : "black"} />
            </TouchableOpacity>
          </View>

          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-lg font-bold`}>Price</Text>
              <Text style={tw`text-lg`}>₹{price}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-lg font-bold`}>Platform Fee</Text>
              <Text style={tw`text-lg`}>₹{platformFee}</Text>
            </View>
            <View style={tw`flex-row justify-between border-t border-gray-300 pt-2 mb-2`}>
              <Text style={tw`text-lg font-bold text-red-600`}>Total Amount</Text>
              <Text style={tw`text-lg font-bold text-red-600`}>₹{totalAmount}</Text>
            </View>
            <View style={tw`border-b border-gray-300`}></View>
          </View>

          <View style={tw`flex-row items-center mb-4`}>
            <TouchableOpacity
              style={tw`w-6 h-6 border border-gray-300 rounded flex items-center justify-center mr-2`}
              onPress={() => setTransportationNeeded(!transportationNeeded)}
            >
              {transportationNeeded && <View style={tw`w-4 h-4 bg-green-500 rounded`} />}
            </TouchableOpacity>
            <Text style={tw`text-lg`}>Transportation Needed</Text>
          </View>

          {transportationNeeded && (
            <>
              <Text style={tw`text-lg font-bold mb-2`}>Location Details</Text>
              <TextInput
                style={tw`bg-gray-200 border border-gray-300 rounded p-2 mb-4`}
                placeholder="Enter location for pickup"
                value={location}
                onChangeText={setLocation}
              />
            </>
          )}

          <Text style={tw`text-lg font-bold mb-2`}>Payment Method</Text>
          <View style={tw`border border-gray-300 rounded bg-gray-200 mb-4`}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={tw`p-2`}
            >
              <Picker.Item label="Select Payment Method" value="" />
              <Picker.Item label="PhonePe" value="phonepe" />
              <Picker.Item label="Google Pay" value="googlepay" />
              <Picker.Item label="Paytm" value="paytm" />
              <Picker.Item label="UPI" value="upi" />
              <Picker.Item label="Internet Banking" value="internetbanking" />
            </Picker>
          </View>

          <TouchableOpacity
            style={tw`bg-green-500 p-3 rounded-lg`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-center text-white text-lg`}>Submit Order</Text>
          </TouchableOpacity>
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

export default Order;
