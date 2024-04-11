import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';

const SecondaryProfileScreen = ({ route }) => {
	const { user } = route.params;
	const firebase = useContext(FirebaseContext);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const checkIfFollowing = async () => {
			const currentUser = firebase.getCurrentUser();
			if (currentUser) {
				const userFollowStatus = await firebase.checkFollowStatus(
					currentUser.uid,
					user.userId
				);
				setIsFollowing(userFollowStatus);
			}
		};
		checkIfFollowing();
	}, [user.userId]);

	const handleFollowToggle = async () => {
		if (isFollowing) {
			await firebase.unfollowUser(user.userId);
		} else {
			await firebase.followUser(user.userId);
		}
		setIsFollowing(prevState => !prevState);
	};

	return (
		<View style={styles.container}>
			<Image source={{ uri: user.profilePhotoUrl }} style={styles.profilePic} />
			<Text style={styles.username}>{user.username}</Text>
			{/* Display other user information as needed */}
			<TouchableOpacity
				style={[
					styles.followButton,
					{ backgroundColor: isFollowing ? 'gray' : 'blue' },
				]}
				onPress={handleFollowToggle}
			>
				<Text style={styles.followButtonText}>
					{isFollowing ? 'Following' : 'Follow'}
				</Text>
			</TouchableOpacity>
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
		marginBottom: 20,
	},
	followButton: {
		backgroundColor: 'blue',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
	},
	followButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default SecondaryProfileScreen;
