import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';

export default function LoadingScreen() {
	const [_, setUser] = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		setTimeout(async () => {
			// sign user automatically if user is already logged in
			const user = firebase.getCurrentUser();
			if (user) {
				const userInfo = await firebase.getUserInfo(user.uid);
				setUser({
					isLoggedIn: true,
					username: userInfo.username,
					email: userInfo.email,
					profilePhotoUrl: userInfo.profilePhotoUrl,
					uid: user.uid,
				});
			} else {
				setUser(state => ({ ...state, isLoggedIn: false }));
			}
		}, 500);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.titleText}>BookTalk</Text>
			<Image
				style={{ width: 150, height: 150 }}
				source={require('../../assets/loadingAnimation.gif')}
			/>
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
	titleText: {
		fontSize: 40,
	},
});
