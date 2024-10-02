import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const router = useRouter();
  const { email, role } = useLocalSearchParams(); // Get email and role from route params
  const [name, setName] = useState('Jaya Surya');
  const [phone, setPhone] = useState('810 639 1368');
  const [emailProfile, setEmailProfile] = useState('jayasurya5556@gmail.com');
  const [location, setLocation] = useState('Ongole');
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/150');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(
          collection(firestore, 'User-data'),
          where('email', '==', email),
          where('role', '==', role)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setName(userData.name || 'Jaya Surya');
          setPhone(userData.phone || '810 639 1368');
          setEmailProfile(userData.emailProfile || 'jayasurya5556@gmail.com');
          setLocation(userData.location || 'Ongole');
        } else {
          Alert.alert('Error', 'No user found.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch user data: ${error.message}`);
      }
    };

    fetchUserData();
  }, [email, role]);

  const handleSave = async () => {
    try {
      const q = query(
        collection(firestore, 'User-data'),
        where('email', '==', email),
        where('role', '==', role)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = doc(firestore, 'User-data', querySnapshot.docs[0].id);

        await updateDoc(userDocRef, {
          name,
          phone,
          emailProfile,
          location,
        });

        Alert.alert('Profile Updated', 'Your profile details have been updated.');
        setIsEditing(false); // Disable editing mode after saving
      } else {
        Alert.alert('Error', 'No user found to update.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your camera roll to change your profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Top Section */}
      <View style={[tw`p-4 items-center justify-center`, { backgroundColor: '#90EE90', height: 180, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }]}>
        
        {/* Left Arrow Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={tw`absolute top-12 left-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Profile Image */}
        <TouchableOpacity onPress={handleImageUpload} style={tw`relative`}>
          <Image source={{ uri: imageUri }} style={tw`w-24 h-24 rounded-full border-4 border-gray-300`} />
          
          {/* Camera Icon at Bottom Right */}
          <View style={tw`absolute right-0 bottom-0 bg-white p-1 rounded-full`}>
            <MaterialIcons name="camera-alt" size={18} color="gray" />
          </View>
        </TouchableOpacity>

        {/* Name */}
        <Text style={tw`text-white text-2xl mt-4`}>{name}</Text>
      </View>

      {/* Profile Fields */}
      <View style={tw`p-4`}>
        {/* Name */}
        <View style={tw`flex-row items-center bg-white p-3 mb-4 rounded-lg`}>
          <MaterialIcons name="person" size={24} color="#90EE90" />
          <Text style={tw`ml-4 text-lg`}>{name}</Text>
        </View>

        {/* Phone */}
        <View style={tw`flex-row items-center bg-white p-3 mb-4 rounded-lg`}>
          <MaterialIcons name="phone" size={24} color="#90EE90" />
          <Text style={tw`ml-4 text-lg`}>{phone}</Text>
        </View>

        {/* Email */}
        <View style={tw`flex-row items-center bg-white p-3 mb-4 rounded-lg`}>
          <MaterialIcons name="email" size={24} color="#90EE90" />
          <Text style={tw`ml-4 text-lg`}>{emailProfile}</Text>
        </View>

        {/* Location */}
        <View style={tw`flex-row items-center bg-white p-3 mb-4 rounded-lg`}>
          <MaterialIcons name="location-on" size={24} color="#90EE90" />
          <Text style={tw`ml-4 text-lg`}>{location}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <View style={tw`p-4`}>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={[tw`p-3 rounded-full items-center`, { backgroundColor: '#90EE90' }]}
        >
          <Text style={tw`text-white text-lg`}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
