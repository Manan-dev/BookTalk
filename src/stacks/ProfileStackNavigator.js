import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BookDetailsScreen from '../screens/BookDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
		</ProfileStack.Navigator>
	);
};

export default ProfileStackNavigator;
