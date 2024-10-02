import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const Cart = () => {
  const router = useRouter();
  const route = useRoute();
  const { itemName, imageUri, cart = [] } = route.params || {}; // Retrieve item details and cart items from params

  const renderCartItem = ({ item }) => (
    <View style={tw`w-full bg-white rounded-lg shadow-lg mb-6 p-4`}>
      <Image source={{ uri: item.imageUri }} style={tw`w-full h-60 rounded-lg`} />
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>{item.name}</Text>
        <Text style={tw`text-lg text-gray-600`}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/Home')} style={tw`flex-row items-center`}>
          <FontAwesome5 name="arrow-left" size={24} color="green" />
          <Text style={tw`text-2xl font-bold text-green-700 ml-2`}>Cart</Text>
        </TouchableOpacity>
      </View>
      {itemName && imageUri ? (
        <View style={tw`w-full bg-white rounded-lg shadow-lg mb-6 p-4`}>
          <Image source={{ uri: imageUri }} style={tw`w-full h-60 rounded-lg`} />
          <View style={tw`p-4`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>{itemName}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={tw`text-center mt-4 text-gray-600`}>Your cart is empty</Text>}
          contentContainerStyle={tw`p-4`}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/screens/Home')} style={styles.footerItem}>
          <FontAwesome5 name="home" size={24} color="green" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Orders')} style={styles.footerItem}>
          <FontAwesome5 name="box" size={24} color="gray" />
          <Text style={styles.footerText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Cart')} style={styles.footerItem}>
          <FontAwesome5 name="shopping-cart" size={24} color="gray" />
          <Text style={styles.footerText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/Profile')} style={styles.footerItem}>
          <MaterialIcons name="person" size={24} color="gray" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Cart;
