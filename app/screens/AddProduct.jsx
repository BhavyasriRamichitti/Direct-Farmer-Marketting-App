import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import tw from 'twrnc';

const AddProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || {}; // Safely access email parameter

  const [productName, setProductName] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [images, setImages] = useState('');

  const handleAddProduct = async () => {
    if (!email) {
      Alert.alert("Error", "No email provided");
      return;
    }

    if (!productName || !pricePerUnit || !description || !category || !quantityAvailable || !images) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(firestore, 'Products'), {
        productName,
        description,
        category,
        pricePerUnit: parseFloat(pricePerUnit),
        quantityAvailable: parseInt(quantityAvailable),
        images: images.split(',').map(img => img.trim()), // Split and trim image URLs
        farmerEmail: email, // Use email parameter
      });
      Alert.alert("Success", "Product added successfully");
      navigation.goBack(); // Navigate back to the product list
    } catch (error) {
      Alert.alert("Error", `Error adding product: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-1 p-6 bg-gray-100`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-3xl font-bold text-[#6A994E] mb-4`}>Add New Product</Text>
        <Text style={tw`text-gray-600 text-lg`}>Fill in the details below to add a new product.</Text>
      </View>

      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={tw`mb-4 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />
      
      <TextInput
        placeholder="Price Per Unit (Rs)"
        value={pricePerUnit}
        keyboardType="numeric"
        onChangeText={setPricePerUnit}
        style={tw`mb-4 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />
      
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={tw`mb-4 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />
      
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={tw`mb-4 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />
      
      <TextInput
        placeholder="Quantity Available"
        value={quantityAvailable}
        keyboardType="numeric"
        onChangeText={setQuantityAvailable}
        style={tw`mb-4 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />
      
      <TextInput
        placeholder="Image URLs (comma separated)"
        value={images}
        onChangeText={setImages}
        style={tw`mb-6 border border-[#6A994E] p-3 rounded-lg bg-white text-[#6A994E] shadow-md`}
        placeholderTextColor="#6A994E"
      />

      <TouchableOpacity
        onPress={handleAddProduct}
        style={tw`bg-[#6A994E] p-4 rounded-lg shadow-lg`}
      >
        <Text style={tw`text-center text-white text-lg font-bold`}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProduct;
