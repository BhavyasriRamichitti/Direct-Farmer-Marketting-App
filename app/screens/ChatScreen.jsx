import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import tw from 'twrnc';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import * as Linking from 'expo-linking'; // For handling phone call functionality

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { farmers } = route.params || {}; // Extract farmers details from route params
  
  const [messages, setMessages] = useState([
    { id: '1', type: 'date', text: 'August 8, 2024' },
    { id: '2', type: 'sent', text: 'Hello!', time: '12:45 PM', status: 'sent' },
    { id: '3', type: 'received', text: 'Hi there! How can I help you today?', time: '12:46 PM', status: 'read' },
    { id: '4', type: 'sent', text: 'I wanted to inquire about the vegetables you have available.', time: '12:47 PM', status: 'sent' },
    { id: '5', type: 'received', text: 'Sure, we have tomatoes, carrots, and potatoes in stock.', time: '12:48 PM', status: 'delivered' },
    { id: '6', type: 'sent', text: 'Great, can I place an order for delivery?', time: '12:49 PM', status: 'sent' },
    { id: '7', type: 'received', text: 'Of course, I will arrange that for you.', time: '12:50 PM', status: 'delivered' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef(null);

  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim()) {
      const currentTime = moment().format('h:mm A');
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: `${prevMessages.length + 1}`, type: 'sent', text: newMessage, time: currentTime, status: 'sent' }
      ]);
      setNewMessage('');
    }
  };

  // Scroll to the bottom of the ScrollView
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Handle call press
  const handleCallPress = () => {
    const phoneNumber = farmers?.phone || '1234567890'; // Use the farmers's phone number
    Linking.openURL(`tel:${phoneNumber}`); // Initiate a phone call
  };

  // Update message status to 'read' when user scrolls to it
  const handleScroll = (event) => {
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;
    const offsetY = event.nativeEvent.contentOffset.y;
    const visibleEnd = visibleHeight + offsetY;

    if (visibleEnd >= contentHeight) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.type === 'received' && msg.status === 'delivered'
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F3F4F6]`}>
      {/* Header with back arrow, user image, mobile number, and icons */}
      <View style={tw`flex-row items-center justify-between bg-[#6A994E] p-4 mt-4`}>
        {/* Left Section: Back arrow, user image, and mobile number */}
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={farmers?.image || { uri: 'https://via.placeholder.com/150' }} // Use farmers's image or a default image
            style={tw`w-10 h-10 rounded-full`}
          />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold text-white`}>
              +91 {farmers?.phone || '96186 01274'}
            </Text>
            <Text style={tw`text-sm text-white`}>
              {farmers?.name || 'Farmers Name'}
            </Text>
          </View>
        </View>

        {/* Right Section: Call and More options icons */}
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity style={tw`ml-4`} onPress={handleCallPress}>
            <Icon name="phone" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`ml-4`}>
            <Icon name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message Display */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={tw`mb-4 ${
              msg.type === 'sent' ? 'self-end bg-[#DCF8C6] p-2 rounded-lg' : 'self-start bg-white p-2 rounded-lg'
            }`}
          >
            <Text>{msg.text}</Text>
            <View style={tw`flex-row items-center justify-end mt-1`}>
              <Text style={tw`text-xs text-gray-500`}>{msg.time}</Text>
              {msg.type === 'sent' && (
                <Icon
                  name={msg.status === 'read' ? 'check-double' : 'check'}
                  type='material'
                  size={16}
                  color={msg.status === 'read' ? '#007AFF' : '#7F8C8D'}
                  containerStyle={tw`ml-2`}
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input box for new messages */}
      <View style={tw`flex-row items-center p-2 border-t border-gray-300`}>
        <TextInput
          style={tw`flex-1 bg-white p-2 rounded-lg`}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity onPress={handleSend} style={tw`ml-2 p-2 bg-[#6A994E] rounded-lg`}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
