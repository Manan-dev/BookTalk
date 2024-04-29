import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import CustomHeader from '../components/CustomHeader';
import CreatePostScreen from '../screens/CreatePostScreen';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import SearchScreen from '../screens/SearchScreen';
import SecondaryProfileScreen from '../screens/SecondaryProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import AboutScreen from '../screens/AboutScreen';

export default MainStackScreens = () => {
	const MainStack = createBottomTabNavigator();

	return (
		<MainStack.Navigator
			screenOptions={{
				header: () => <CustomHeader />,
				tabBarShowLabel: false,
				tabBarActiveTintColor: '#161F3D',
				tabBarInactiveTintColor: '#B8BBC4',
				tabBarStyle: {
					backgroundColor: '#fff',
				},
			}}
		>
			<MainStack.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-home" color={color} size={size} />
					),
				}}
			/>
			<MainStack.Screen
				name="Search"
				component={SearchScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-search" color={color} size={size} />
					),
				}}
			/>
			<MainStack.Screen
				name="CreatePost"
				component={CreatePostScreen}
				options={{
					tabBarIcon: () => (
						<Ionicons name="ios-add-circle" color="#E9446A" size={52} />
					),
				}}
			/>
			<MainStack.Screen
				name="Message"
				component={MessageScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-chatbox" color={color} size={size} />
					),
				}}
			/>
			<MainStack.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-person" color={color} size={size} />
					),
				}}
			/>
			<MainStack.Screen
				name="SecondaryProfile"
				component={SecondaryProfileScreen}
				options={{ tabBarButton: () => null }}
			/>

			<MainStack.Screen
				name="BookDetailsScreen"
				component={BookDetailsScreen}
				options={{ 
					tabBarButton: () => null,
					title: 'Book Details',
				 }}
			/>		

			<MainStack.Screen
				name="AboutScreen"
				component={AboutScreen}
				options={{ 
					tabBarButton: () => null,
					title: 'About',
				}}
			/>	
		</MainStack.Navigator>
	);
};
