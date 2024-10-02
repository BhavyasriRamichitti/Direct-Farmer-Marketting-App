import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator, Alert, Modal, Pressable, ScrollView, ImageBackground } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const languages = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Malayalam', 'Kannada',
  'Punjabi', 'Odia', 'Assamese', 'Maithili', 'Sanskrit', 'Nepali', 'Arabic', 'French', 'Spanish', 'German', 'Chinese', 'Japanese'
];

const HomeScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { email } = route.params || {};

  const [userName, setUserName] = useState('Jayasurya');
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, []);

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity style={tw`py-2`}>
      <Text style={tw`text-lg text-gray-700`}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://your-background-image-url.com' }} // Replace with your background image URL
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 bg-white bg-opacity-80`}>
        <ScrollView contentContainerStyle={tw`px-5 pt-4 pb-24`}>
          {/* Header Section */}
          <View style={tw`flex-row justify-between items-center mb-10`}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`flex-row items-center`}>
              <Entypo name="menu" size={35} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/screens/Map')} style={tw`flex-row items-center mx-2 ml-40`}>
              <Ionicons name="location" size={30} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/screens/predict')} style={tw`flex-row items-center mx-2 `}>
              <Ionicons name="notifications" size={30} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={tw`flex-row items-center mb-5`}>
            <Image
              source={require('./../../assets/jayasurya.jpg')} // Replace with your profile image path
              style={tw`w-12 h-12 rounded-full mr-3`}
            />
            <View>
              <Text style={tw`text-sm text-gray-500`}>Good Morning,</Text>
              <Text style={tw`text-lg font-bold text-gray-800`}>{userName}</Text>
            </View>
          </View>

          {/* Search Bar Section */}
          <View style={tw`mb-5`}>
            <View style={tw`flex-row items-center bg-white rounded-md px-4 py-2 shadow`}>
              <FontAwesome5 name="search" size={20} color="#888" style={tw`mr-2`} />
              <TextInput
                style={tw`flex-1 text-base text-gray-700`}
                placeholder="Search for commodities, buyers..."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Weather Section */}
          <View style={tw`bg-blue-100 rounded-md p-5 mb-5 shadow`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Today's Weather</Text>
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text style={tw`text-3xl font-bold text-gray-800`}>28°C</Text>
                <Text style={tw`text-base text-gray-600 my-1`}>Cloudy</Text>
                <Text style={tw`text-sm text-gray-500`}>Humidity: 82%</Text>
              </View>
              <Image
                source={{ uri: 'https://your-weather-icon-url.com' }} // Replace with your weather icon URL
                style={tw`w-15 h-15`}
              />
            </View>
            <Text style={tw`mt-3 text-sm text-gray-700`}>
              It’s a good day to apply pesticides to your crops.
            </Text>
          </View>

          {/* Buyer Demand Section */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-base font-bold text-gray-700`}>Today's Buyer Demand</Text>
            <Text style={tw`text-sm text-gray-500`}>4,450 Products in Total</Text>
          </View>

          {/* Commodities Section */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Commodities & Food</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`flex-row`}>
              <View style={tw`bg-white rounded-md p-5 mr-3 items-center shadow`}>
                <Text style={tw`text-3xl`}>🍅</Text>
                <Text style={tw`mt-2 text-sm text-gray-700`}>Vegetables</Text>
              </View>
              <View style={tw`bg-white rounded-md p-5 mr-3 items-center shadow`}>
                <Text style={tw`text-3xl`}>🍇</Text>
                <Text style={tw`mt-2 text-sm text-gray-700`}>Fruits</Text>
              </View>
              <View style={tw`bg-white rounded-md p-5 mr-3 items-center shadow`}>
                <Text style={tw`text-3xl`}>🌾</Text>
                <Text style={tw`mt-2 text-sm text-gray-700`}>Grains</Text>
              </View>
              <View style={tw`bg-white rounded-md p-5 items-center shadow`}>
                <Text style={tw`text-3xl`}>🍞</Text>
                <Text style={tw`mt-2 text-sm text-gray-700`}>Other</Text>
              </View>
            </ScrollView>
          </View>

          {/* Community Section */}
          <View style={tw`mb-10`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Community Groups</Text>
            <View style={tw`flex-col`}>
              <View style={tw`flex-row justify-between items-center bg-white rounded-md p-4 mb-3 shadow`}>
                <View>
                  <Text style={tw`text-base font-bold text-gray-800`}>🌾 Farming Community</Text>
                  <Text style={tw`text-sm text-gray-500`}>Public Group • 128 Members</Text>
                </View>
                <TouchableOpacity style={tw`bg-green-500 rounded-full px-4 py-1`}>
                  <Text style={tw`text-sm font-bold text-white`}>Join</Text>
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row justify-between items-center bg-white rounded-md p-4 shadow`}>
                <View>
                  <Text style={tw`text-base font-bold text-gray-800`}>🌱 Agriculture Community</Text>
                  <Text style={tw`text-sm text-gray-500`}>Public Group • 256 Members</Text>
                </View>
                <TouchableOpacity style={tw`bg-green-500 rounded-full px-4 py-1`}>
                  <Text style={tw`text-sm font-bold text-white`}>Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Modal for the side menu */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={tw`flex-1 bg-gray-800 bg-opacity-50`}>
            <View style={tw`bg-white w-3/4 p-4 border-r-2 border-gray-200 h-full absolute left-0 top-0`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Options</Text>
              {/* Add your menu items here */}
              <TouchableOpacity style={tw`mb-4`} onPress={() => setLanguageModalVisible(true)}>
                <Text style={tw`text-lg text-gray-700`}>Change Language</Text>
              </TouchableOpacity>
              {/* Add more items here */}
              <Pressable
                style={tw`absolute bottom-10 left-4`}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={tw`text-base text-red-600`}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal for the three-dot options (Side Menu) */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 bg-gray-800 bg-opacity-50`}>
          <View style={tw`bg-white w-3/4 p-4 border-r-2 border-gray-200 h-full absolute left-0 top-0`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Options</Text>
            <TouchableOpacity onPress={() => { setLanguageModalVisible(true); }} style={tw`py-2 border-b border-gray-200`}>
              <Text style={tw`text-lg text-gray-700`}>Select Your Languages</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Handle Payments */ setModalVisible(false); }} style={tw`py-2 border-b border-gray-200`}>
              <Text style={tw`text-lg text-gray-700`}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/screens/predict')} style={tw`py-2 border-b border-gray-200`}>
                                <Text style={tw`text-lg text-gray-700`}>Crop Predicton</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Handle Settings */ setModalVisible(false); }} style={tw`py-2`}>
              <Text style={tw`text-lg text-gray-700`}>Settings</Text>
            </TouchableOpacity>
            <Pressable
              style={tw`py-2 mt-4 bg-gray-100 rounded-full`}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={tw`text-center text-lg text-gray-600`}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal for Language Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => {
          setLanguageModalVisible(!languageModalVisible);
        }}
      >
        <View style={tw`flex-1 bg-gray-800 bg-opacity-50`}>
          <View style={tw`bg-white w-3/4 p-4 border-r-2 border-gray-200 h-full absolute left-0 top-0`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Select Your Languages</Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item}
              contentContainerStyle={tw`flex-grow`}
            />
            <Pressable
              style={tw`py-2 mt-4 bg-gray-100 rounded-full`}
              onPress={() => setLanguageModalVisible(!languageModalVisible)}
            >
              <Text style={tw`text-center text-lg text-gray-600`}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        {/* Bottom Navigation */}
        <View style={tw`absolute bottom-0 left-0 right-0 flex-row justify-around bg-white py-3 shadow-lg`}>
          <TouchableOpacity onPress={() => router.push('/screens/Fhome')} style={tw`items-center`}>
            <FontAwesome5 name="home" size={24} color="green" />
            <Text style={tw`text-sm text-gray-700 mt-1`}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push({ pathname: '/screens/ProductList', params: { email } })} style={tw`items-center`}>
            <FontAwesome5 name="box" size={24} color="gray" />
            <Text style={tw`text-sm text-gray-700 mt-1`}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/screens/OrderList')} style={tw`items-center`}>
            <FontAwesome5 name="shopping-cart" size={24} color="gray" />
            <Text style={tw`text-sm text-gray-700 mt-1`}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={tw`items-center`}>
            <MaterialIcons name="person" size={24} color="gray" />
            <Text style={tw`text-sm text-gray-700 mt-1`}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
