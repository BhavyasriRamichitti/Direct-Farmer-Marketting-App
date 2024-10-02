import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { firestore, auth } from '../config/firebaseConfig'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

const RegisterScreen = () => {
  const [userType, setUserType] = useState('farmer'); // Default user type
  const [name, setName] = useState(''); // New state for Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Add user data to Firestore
      await addDoc(collection(firestore, 'User-data'), {
        name, // Include the name field
        email,
        password, // Note: Storing passwords in plaintext is a security risk. Use authentication methods to handle passwords.
        role: userType.charAt(0).toUpperCase() + userType.slice(1),
      });

      Alert.alert('Success', 'Registration Successful');

      // Navigate to the login screen after successful registration
      router.push('/screens/Login');
    } catch (error) {
      Alert.alert('Error', `Registration failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🌱</Text>
        </View>
      </View>

      <Text style={styles.title}>Register</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'farmer' ? styles.activeToggleButton : {}]}
          onPress={() => setUserType('farmer')}
        >
          <Text style={[styles.toggleButtonText, userType === 'farmer' ? styles.activeToggleButtonText : {}]}>Farmer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'retailer' ? styles.activeToggleButton : {}]}
          onPress={() => setUserType('retailer')}
        >
          <Text style={[styles.toggleButtonText, userType === 'retailer' ? styles.activeToggleButtonText : {}]}>Consumer </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          theme={{
            colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' },
          }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCompleteType="email"
          textContentType="emailAddress"
          mode="outlined"
          theme={{
            colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' },
          }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          textContentType="password"
          mode="outlined"
          theme={{
            colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' },
          }}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          textContentType="password"
          mode="outlined"
          theme={{
            colors: { text: '#6A994E', placeholder: '#8B8B8B', background: '#FFF', primary: '#6A994E' },
          }}
        />
        <Text style={styles.roleText}>Role: {userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginLinkText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/screens/Login')}>
          <Text style={styles.loginLink}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EDF7E1', // Light greenish background color
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop:15,
    borderRadius: 50,
    marginBottom: 15,
  },
  logo: {
    
    fontSize: 36,
    color: '#6A994E', // Green color for the logo
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A994E', // Green text color
    textAlign: 'center',
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#6A994E',
    backgroundColor: '#FFF',
  },
  activeToggleButton: {
    backgroundColor: '#6A994E', // Green background for active button
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#6A994E', // Green text for inactive buttons
  },
  activeToggleButtonText: {
    color: '#FFF', // White text for active button
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  roleText: {
    fontSize: 18,
    color: '#6A994E',
    textAlign: 'center',
    marginVertical: 15,
  },
  registerButton: {
    backgroundColor: '#6A994E',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLinkText: {
    color: '#6A994E',
    fontSize: 16,
  },
  loginLink: {
    color: '#6A994E',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
};
export default RegisterScreen;