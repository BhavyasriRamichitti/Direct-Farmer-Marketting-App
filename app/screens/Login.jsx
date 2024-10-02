import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { firestore } from '../config/firebaseConfig'; 
import { query, collection, where, getDocs } from 'firebase/firestore';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer'); // Default role
  const router = useRouter();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Query Firestore to check if the user exists with the given email, password, and role
      const q = query(
        collection(firestore, 'User-data'),
        where('email', '==', email),
        where('password', '==', password),
        where('role', '==', role.charAt(0).toUpperCase() + role.slice(1)) // Capitalize first letter of role
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists
        Alert.alert('Success', 'Login Successful');
        
        // Redirect based on role
        if (role === 'farmer') {
          router.push({
            pathname: '/screens/Fhome',
            params: { email }
          });
        } else if (role === 'retailer') {
          router.push({
            pathname: '/screens/Home',
            params: { email }
          });
        }
      } else {
        // User does not exist
        Alert.alert('Error', 'Invalid credentials. Please check your email, password, and role.');
      }
    } catch (error) {
      Alert.alert('Error', `Login failed: ${error.message}`);
    }
  };

  const handleRegister = () => {
    router.push('screens/Register'); // Ensure this route matches your routing setup
  };

  return (
    <View style={tw`flex-1 justify-center p-4 bg-white`}>
      {/* Header and Logo */}
      <View style={tw`mb-8`}>
        <View style={tw`mb-4`}>
          <Text style={tw`text-4xl text-center`}>🌿</Text>
        </View>
        <Text style={tw`text-2xl text-center font-bold`}>Welcome</Text>
        <Text style={tw`text-lg text-center text-gray-500`}>Login to Continue!</Text>
      </View>

      {/* Email Input */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={tw`mb-4`}
        keyboardType="email-address"
        textContentType="emailAddress"
        mode="outlined"
        theme={{
          colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' }
        }}
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        style={tw`mb-4`}
        secureTextEntry
        textContentType="password"
        mode="outlined"
        theme={{
          colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' }
        }}
      />

      {/* Role Selection */}
      <View style={tw`flex-row justify-between mb-8`}>
        <TouchableOpacity
          style={[
            tw`flex-1 py-4 mx-2 rounded-full border`,
            { borderColor: role === 'farmer' ? '#6A994E' : '#C0C0C0', backgroundColor: role === 'farmer' ? '#6A994E' : '#FFF' }
          ]}
          onPress={() => setRole('farmer')}
        >
          <Text style={[tw`text-center`, { color: role === 'farmer' ? '#FFF' : '#6A994E', fontWeight: 'bold' }]}>
            Farmer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`flex-1 py-4 mx-2 rounded-full border`,
            { borderColor: role === 'retailer' ? '#6A994E' : '#C0C0C0', backgroundColor: role === 'retailer' ? '#6A994E' : '#FFF' }
          ]}
          onPress={() => setRole('retailer')}
        >
          <Text style={[tw`text-center`, { color: role === 'retailer' ? '#FFF' : '#6A994E', fontWeight: 'bold' }]}>
            Consumer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={[tw`p-4 rounded-full`, { backgroundColor: '#6A994E' }]}
      >
        <Text style={[tw`text-center`, { color: '#FFF', fontSize: 16, fontWeight: 'bold' }]}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity
        onPress={handleRegister}
        style={[tw`mt-4 p-4 rounded-full border`, { borderColor: '#6A994E' }]}
      >
        <Text style={[tw`text-center`, { color: '#6A994E', fontSize: 16, fontWeight: 'bold' }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;