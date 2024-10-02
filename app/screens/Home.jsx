import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import tw from 'twrnc'; // Import the i18n configuration
import { createClient } from 'pexels';
import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import Voice from 'react-native-voice';
import { firestore } from '../config/firebaseConfig'; // Import from your config
import { query, collection, where, getDocs } from 'firebase/firestore';


const client = createClient('ncvaPpzM2GPQspM4s9VoHHRmPetcdJeHEaZYfcmI5ggShFsjuHfcuoai');

const categories = [
  { id: '1', name: 'Fruits', queries: ['Mango', 'Apples', 'Grapes', 'Pineapples', 'Bananas', 'Oranges', 'Strawberry', 'Kiwi', 'Bluberry', 'Watermelon'], icon: require('./../../assets/fruits.jpeg') },
  { id: '2', name: 'Grains', queries: ['rice', 'wheat', 'oats', 'Barley', 'Quinoa', 'Corn', 'Millet', 'Rye', 'Buckwheat', 'Farro'], icon: require('./../../assets/grains.jpeg') },
  { id: '3', name: 'Vegetables', queries: ['Tomato', 'Potato', 'Carrot', 'Onion', 'chili', 'Broccoli', 'Bell Pepper', 'Cucumber', 'Cauliflower'], icon: require('./../../assets/image3.jpeg') },
  { id: '4', name: 'Rice', queries: ['white rice', 'brown rice'], icon: require('./../../assets/rice.jpeg') },
];

const languages = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Malayalam', 'Kannada',
  'Punjabi', 'Odia', 'Assamese', 'Maithili', 'Sanskrit', 'Nepali', 'Arabic', 'French', 'Spanish', 'German', 'Chinese', 'Japanese'
];
const Home = () => {
  const route = useRoute();  // Initialize the route
  const router = useRouter();  // Initialize the router
  const { email } = route.params || {};
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to Fruits
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [retailerName, setRetailerName] = useState('Retailer');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]); // State to store cart items
  const [likedItems, setLikedItems] = useState({}); // State to track liked items
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility


  useEffect(() => {
    if (email) {
      fetchRetailerName(email);
    }
  }, [email]);
  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity style={tw`py-2 border-b border-gray-200`}>
      <Text style={tw`text-lg text-gray-700`}>{item}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const fetchRetailerName = async (email) => {
    try {
      const q = query(collection(firestore, 'User-data'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setRetailerName(userData.name || 'Retailer');
      } else {
        Alert.alert('Error', 'No retailer found with this email.');
      }
    } catch (error) {
      console.error('Error fetching retailer name:', error.message || error);
      Alert.alert('Error', 'Error fetching retailer name: ' + (error.message || 'An unknown error occurred.'));
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const category = selectedCategory || { queries: [searchQuery] };
      const queries = category.queries || [searchQuery];
      const allProducts = [];

      for (const query of queries) {
        const response = await client.photos.search({
          query: query,
          per_page: 1,
        });

        if (response.photos.length > 0) {
          const photo = response.photos[0];
          const product = {
            id: photo.id,
            name: query,
            price: '₹100',
            rating: Math.random() * (5 - 3) + 3,
            image: { uri: photo.src.medium },
            location: 'City Name',
          };
          allProducts.push(product);
        }
      }

      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error.message || error);
      Alert.alert('Error', 'Error fetching products: ' + (error.message || 'An unknown error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setSelectedCategory(null);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const onSpeechResults = (e) => {
    setResults(e.value);
    if (e.value && e.value.length > 0) {
      setSearchQuery(e.value[0]);
    }
  };

  const onSpeechError = (e) => {
    Alert.alert('Error', e.error.message);
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
  };

  const toggleLike = (item) => {
    const itemId = item.id;
    const isLiked = likedItems[itemId];

    setLikedItems((prevLikedItems) => ({
      ...prevLikedItems,
      [itemId]: !isLiked,
    }));

    if (!isLiked) {
      // Add item to the cart
      addToCart(item);

      // Navigate to Cart page with item details
      router.push({
        pathname: '/screens/Cart',
        params: { itemName: item.name, imageUri: item.image.uri },
      });
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item);
        setSearchQuery('');
      }}
      style={tw`items-center mx-4`}
    >
      <Image source={item.icon} style={tw`w-16 h-16 rounded-full bg-gray-200`} />
      <Text style={tw`text-center text-sm text-gray-800 mt-1`}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={tw`w-full bg-white rounded-lg mb-4 shadow-md p-4`}
      onPress={() => {
        // Navigate to ItemDetail and pass item details
        router.push({
          pathname: '/screens/ItemDetail',
          params: { itemName: item.name, imageUri: item.image.uri },
        });
      }}
    >
      <Image source={item.image} style={tw`w-full h-48 rounded-t-lg`} />
      <View style={tw`p-3 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
          <Text style={tw`text-base text-gray-600`}>{item.price}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-sm text-yellow-600`}>⭐ {item.rating.toFixed(1)}</Text>
          <TouchableOpacity
            onPress={() => toggleLike(item)}
            style={[
              tw`ml-2 p-1 border rounded-full`,
              likedItems[item.id]
                ? tw`border-red-500`
                : tw`border-gray-300`,
            ]}
          >
            <Ionicons
              name="heart"
              size={30}
              color={likedItems[item.id] ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`px-4 py-4 bg-gray-100`}>
        <View style={tw`flex-row justify-between`}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`flex-row items-center mt-10`}>
            <Entypo name="menu" size={35} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-green-700 mt-10 ml-2`}> {retailerName}</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity onPress={() => router.push('/screens/Map')} style={tw`flex-row items-center mx-2 mt-10`}>
              <Ionicons name="location" size={25} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/screens/predict')} style={tw`flex-row items-center mx-2 mt-10`}>
              <Ionicons name="notifications" size={25} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`flex-row items-center bg-teal-100 px-4 rounded-full shadow-lg mt-4 h-16 w-full`}>
          <Ionicons name="search" size={25} color="gray" />
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={tw`flex-1 ml-2 text-lg text-gray-700`}
            returnKeyType="search"
            onSubmitEditing={() => fetchProducts()}
          />
          <TouchableOpacity onPress={startRecognizing} style={tw`p-2`}>
            <MaterialIcons name="keyboard-voice" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`py-4 px-2 bg-gray-100`}
        />
      </View>

      <View style={tw`px-4`}>
        {loading ? (
          <ActivityIndicator size="large" color="green" style={tw`mt-20`} />
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`mt-4`}
          />
        ) : (
          <Text style={tw`text-center text-lg text-gray-600 mt-20`}>No products found.</Text>
        )}
      </View>

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
      <View style={tw`flex-row justify-around p-4 bg-white border-t border-gray-200 absolute bottom-0 left-0 right-0`}>
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

export default Home;