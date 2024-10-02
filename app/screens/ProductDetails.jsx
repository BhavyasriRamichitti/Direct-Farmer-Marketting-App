import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firestore } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import tw from 'twrnc';

const ProductDetails = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params || {}; // Get productId from navigation

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        Alert.alert("Error", "Product ID is missing");
        return;
      }

      try {
        const productRef = doc(firestore, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProductName(productData.productName);
          setDescription(productData.description);
          setPricePerUnit(productData.pricePerUnit.toString()); // Convert to string for input field
          setQuantityAvailable(productData.quantityAvailable.toString()); // Convert to string
          setCategory(productData.category);
          setImage(productData.image || '');
        } else {
          Alert.alert("Error", "Product not found");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", `Error fetching product: ${error.message}`);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSavePress = async () => {
    if (!productName || !description || !pricePerUnit || !quantityAvailable || !category) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const productRef = doc(firestore, 'Products', productId);

      await updateDoc(productRef, {
        productName,
        description,
        pricePerUnit: parseFloat(pricePerUnit),
        quantityAvailable: parseInt(quantityAvailable),
        category,
        image,
      });

      Alert.alert("Success", "Product updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", `Error updating product: ${error.message}`);
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-4 bg-[#EDF7E1]`}> 
      <View style={tw`bg-white p-6 rounded-lg shadow-md`}>
        <Text style={tw`text-3xl font-bold mb-6 text-center text-[#6A994E]`}>
          Edit Product
        </Text>

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`}
          placeholder="Product Name"
          placeholderTextColor="#6A994E" 
          value={productName}
          onChangeText={setProductName}
        />

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`}
          placeholder="Description"
          placeholderTextColor="#6A994E" 
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`} 
          placeholder="Price Per Unit"
          placeholderTextColor="#6A994E" 
          keyboardType="numeric"
          value={pricePerUnit}
          onChangeText={setPricePerUnit}
        />

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`} 
          placeholder="Quantity Available"
          placeholderTextColor="#6A994E" 
          keyboardType="numeric"
          value={quantityAvailable}
          onChangeText={setQuantityAvailable}
        />

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`} 
          placeholder="Category"
          placeholderTextColor="#6A994E"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={tw`border border-[#6A994E] p-3 rounded-lg mb-4 shadow-sm bg-white text-[#6A994E]`} 
          placeholder="Image URL"
          placeholderTextColor="#6A994E" 
          value={image}
          onChangeText={setImage}
        />

        <TouchableOpacity
          style={tw`bg-[#6A994E] p-4 rounded-lg shadow-md`} 
          onPress={handleSavePress}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;
