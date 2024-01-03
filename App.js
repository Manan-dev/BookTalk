import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { FirebaseProvider } from './src/context/FirebaseContext';
import { UserProvider } from './src/context/UserContext';
import AppStackScreens from './src/stacks/AppStackScreens';

export default App = () => {
	return (
		<FirebaseProvider>
			<UserProvider>
				<NavigationContainer>
					<StatusBar barStyle="dark-content" />
					<AppStackScreens />
				</NavigationContainer>
			</UserProvider>
		</FirebaseProvider>
	);
};
