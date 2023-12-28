import { Button } from '@rneui/themed';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';

export default function ProfileScreen() {
	const [user, setUser] = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

	handleLogout = async () => {
		const loggedOut = await firebase.logout();

		if (loggedOut) {
			setUser(state => ({ ...state, isLoggedIn: false }));
		}
	};
	return (
		<View style={styles.container}>
			<Text>Username: {user.username}</Text>
			<Text>Email: {user.email}</Text>

			<Button buttonStyle={styles.logoutButton} onPress={handleLogout}>
				Log Out
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoutButton: {
		width: 'auto',
		borderRadius: 10,
		alignSelf: 'center',
	},
});
