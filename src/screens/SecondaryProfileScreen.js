import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const SecondaryProfileScreen = ({ route }) => {
	const { user } = route.params;

	return (
		<View style={styles.container}>
			<Image source={{ uri: user.profilePhotoUrl }} style={styles.profilePic} />
			<Text style={styles.username}>{user.username}</Text>
			{/* Display other user information as needed */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	profilePic: {
		width: 150,
		height: 150,
		borderRadius: 75,
		marginBottom: 20,
	},
	username: {
		fontSize: 24,
		fontWeight: 'bold',
	},
});

export default SecondaryProfileScreen;
