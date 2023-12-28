import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import LoadingScreen from '../screens/LoadingScreen';
import AuthStackScreens from './AuthStackScreens';
import MainStackScreens from './MainStackScreens';

const AppStackScreens = () => {
	const AppStack = createStackNavigator();

	const [user] = useContext(UserContext);

	return (
		<AppStack.Navigator screenOptions={{ headerShown: false }}>
			{user.isLoggedIn === null ? (
				<AppStack.Screen name="Loading" component={LoadingScreen} />
			) : user.isLoggedIn === true ? (
				<AppStack.Screen name="Main" component={MainStackScreens} />
			) : (
				<AppStack.Screen name="Auth" component={AuthStackScreens} />
			)}
		</AppStack.Navigator>
	);
};

export default AppStackScreens;
