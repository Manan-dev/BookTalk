import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BookDetailsScreen from '../screens/BookDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					headerShown: false,
				}}
			/>
			<ProfileStack.Screen
				name="BookDetailsScreen"
				component={BookDetailsScreen}
				options={{
					title: 'Book Details',
				}}
			/>
			<ProfileStack.Screen
				name="AboutScreen"
				component={AboutScreen}
				options={{
					title: 'About',
				}}
			/>
		</ProfileStack.Navigator>
	);
};

export default ProfileStackNavigator;
