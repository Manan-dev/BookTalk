import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';

export default MainStackScreens = () => {
	const MainStack = createBottomTabNavigator();
	return (
		<MainStack.Navigator screenOptions={{ headerShown: false }}>
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
				name="Post"
				component={PostScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-add-circle" color={color} size={size} />
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
		</MainStack.Navigator>
	);
};
