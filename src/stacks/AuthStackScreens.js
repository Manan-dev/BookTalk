import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';

const AuthStackScreens = () => {
	const AuthStack = createStackNavigator();

	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Signin" component={SigninScreen} />
			<AuthStack.Screen name="Signup" component={SignupScreen} />
		</AuthStack.Navigator>
	);
};

export default AuthStackScreens;
