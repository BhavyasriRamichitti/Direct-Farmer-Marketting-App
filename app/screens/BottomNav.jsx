// BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white shadow p-4 flex-row justify-around`}>
      <TouchableOpacity onPress={() => router.push('/screens/Home')} style={tw`items-center`}>
        <FontAwesome5 name="home" size={24} color="green" />
        <Text style={tw`text-sm text-green-700 mt-1`}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/screens/Orders')} style={tw`items-center`}>
        <FontAwesome5 name="box" size={24} color="gray" />
        <Text style={tw`text-sm text-gray-600 mt-1`}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/screens/Cart')} style={tw`items-center`}>
        <FontAwesome5 name="shopping-cart" size={24} color="gray" />
        <Text style={tw`text-sm text-gray-600 mt-1`}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={tw`items-center`}>
        <MaterialIcons name="person" size={24} color="gray" />
        <Text style={tw`text-sm text-gray-600 mt-1`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;
