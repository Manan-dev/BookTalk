import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function LoadingScreen() {
	const [_, setUser] = useContext(UserContext);

	useEffect(() => {
		setTimeout(async () => {
			setUser(state => ({ ...state, isLoggedIn: false }));
		}, 1000);
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
