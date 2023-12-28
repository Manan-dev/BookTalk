import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { FirebaseProvider } from './src/context/FirebaseContext';
import { UserProvider } from './src/context/UserContext';
import AppStackScreens from './src/stacks/AppStackScreens';

export default App = () => {
	return (
		<FirebaseProvider>
			<UserProvider>
				<NavigationContainer>
					{/* Rest of your app code */}
					<AppStackScreens />
				</NavigationContainer>
			</UserProvider>
		</FirebaseProvider>
	);
};
