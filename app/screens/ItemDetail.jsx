import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import tw from 'twrnc';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

const ItemDetail = () => {
  const route = useRoute();
  const router = useRouter();

  const itemName = route.params?.itemName || 'Grapes';  // Default name to 'Grapes'
  const imageUri = route.params?.imageUri || 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&h=350';  // Default image URI

  useEffect(() => {
    console.log('Item Name:', itemName);
    console.log('Image URI:', imageUri);
  }, [itemName, imageUri]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Sample data for farmers
  const farmers = [
    { id: '1', name: 'Hod Sir', phone: '8297313195', location: 'Kovvada, Bhimavaram', image: require('../../assets/hodsir.jpg') },
    { id: '2', name: 'Durga Madam', phone: '9515119404', location: 'Kovvada, Bhimavaram', image: require('../../assets/durgamadam.jpg') },
    { id: '3', name: 'Jayasurya', phone: '8106391368', location: 'Sujatha Nagar, Ongole', image: require('../../assets/jayasurya.jpg') },
    { id: '4', name: 'Venkat', phone: '7013660304', location: 'Pedda Puram, Vijayawada', image: require('../../assets/venkat.jpg') },
    { id: '5', name: 'Surya', phone: '9160484599', location: 'Sujatha Nagar, Ongole', image: require('../../assets/surya.jpg') },
    { id: '6', name: 'Prabhas', phone: '7032871262', location: 'Machilipatnam, Krishna', image: require('../../assets/prabhas.jpeg') },
    { id: '7', name: 'Prudhvi', phone: '8341781125', location: 'Lingamgunta, Ongole', image: require('../../assets/prudhvi.jpg') },
  ];

  const handleCallPress = (farmer) => {
    setSelectedFarmer(farmer);
    setModalVisible(true);
  };

  const confirmCall = () => {
    setModalVisible(false);
    const phoneNumber = selectedFarmer?.phone || '1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleVideoCall = (farmer) => {
    const phoneNumber = farmer?.phone;
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(whatsappUrl)
      .catch(() => alert('WhatsApp is not installed on this device'));
  };

  const renderFarmerItem = ({ item }) => (
    <View style={tw`p-4 bg-white rounded-lg shadow mb-2`}>
      <View style={tw`flex-row items-start`}>
        <Image source={item.image} style={tw`w-16 h-16 rounded-full`} />
        <View style={tw`ml-2 flex-1`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="location" size={20} color="#6A994E" />
            <Text style={tw`ml-1 text-base text-gray-500`}>{item.location}</Text>
          </View>
          <View style={tw`flex-row justify-between mt-2`}>
            <TouchableOpacity onPress={() => handleCallPress(item)}>
              <Ionicons name="call" size={24} color="#6A994E" />
              <Text style={tw`ml-1 text-[#6A994E]`}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => router.push('/screens/ChatScreen', { farmer: item })}
            >
              <Ionicons name="chatbubbles" size={24} color="blue" />
              <Text style={tw`ml-1 text-blue-600`}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleVideoCall(item)}>
              <Ionicons name="videocam" size={24} color="red" />
              <Text style={tw`ml-1 text-red-500`}>Video Call</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
  style={tw`mt-4 bg-[#6A994E] p-3 rounded-lg`} 
  onPress={() => router.push({
    pathname: '/screens/Order',
    params: { itemName: itemName, imageUri: imageUri }
  })}
>
  <Text style={tw`text-center text-white text-lg`}>Order Now</Text>
</TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-[#EDF7E1]`}>
      <ScrollView contentContainerStyle={tw`flex-1`}>
        <View style={tw`w-full h-64`}>
          <Image source={{ uri: imageUri }} style={tw`w-full h-full object-cover rounded-b-lg shadow-lg`} />
        </View>
        <View style={tw`p-4 bg-white rounded-t-lg shadow`}>
          <Text style={tw`text-2xl font-bold text-center text-gray-800`}>{itemName}</Text>
        </View>

        <View style={tw`p-4 bg-white mt-2 rounded-lg shadow`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>Related Farmers</Text>
          <FlatList
            data={farmers}
            renderItem={renderFarmerItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={tw`pb-4`}
          />
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

      {/* Call Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-lg shadow-lg w-80`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Confirm Call</Text>
            <Text style={tw`text-base text-gray-600 mb-4`}>
              Are you sure you want to call {selectedFarmer?.name} at {selectedFarmer?.phone}?
            </Text>
            <View style={tw`flex-row justify-between`}>
              <Pressable onPress={confirmCall} style={tw`bg-green-500 p-2 rounded-lg`}>
                <Text style={tw`text-white text-center font-bold`}>Yes</Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)} style={tw`bg-gray-300 p-2 rounded-lg`}>
                <Text style={tw`text-gray-800 text-center font-bold`}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ItemDetail;
