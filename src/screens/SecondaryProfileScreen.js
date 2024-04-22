import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Carousel from '../components/Carousel';
import { FirebaseContext } from '../context/FirebaseContext';
import booksReadData from '../data/booksReadCopy.json';

const SecondaryProfileScreen = ({ route }) => {
	const { user } = route.params;
	const firebase = useContext(FirebaseContext);
	const navigation = useNavigation();

	const [isFollowing, setIsFollowing] = useState(false);
	const [followersCount, setFollowerCount] = useState(0);
	const [isModalVisible, setModalVisible] = useState(false);
	const [followingCount, setFollowingCount] = useState(0);
	const [postCount, setPostCount] = useState(0);
	const [bio, setBio] = useState('');
	const [showMore, setShowMore] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchFollowerCount();
		fetchFollowingCount();
		fetchPostCount();
		fetchBio();
	}, []);

	const fetchFollowerCount = async () => {
		try {
			// Call Firebase method to get follower count
			const count = await firebase.getFollowerCount(user.userId);
			setFollowerCount(count);
		} catch (error) {
			console.error('Error fetching follower count:', error);
		}
	};

	const fetchFollowingCount = async () => {
		try {
			// Call Firebase method to get following count
			const count = await firebase.getFollowingCount(user.userId);
			setFollowingCount(count);
		} catch (error) {
			console.error('Error fetching following count:', error);
		}
	};

	const fetchPostCount = async () => {
		try {
			// Call Firebase method to get post count
			const count = await firebase.getPostCount(user.userId);
			setPostCount(count);
		} catch (error) {
			console.error('Error fetching post count:', error);
		}
	};

	const fetchBio = async () => {
		const userData = await firebase.getUserInfo(user.userId);
		if (userData && userData.bio) {
			setBio(userData.bio);
		}
	};

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

	const booksReadTitles = booksReadData.map(book => book.title);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const handleFollowToggle = async () => {
		if (isFollowing) {
			await firebase.unfollowUser(user.userId);
		} else {
			await firebase.followUser(user.userId);
		}
		setIsFollowing(prevState => !prevState);
	};

	const handleBackNavigation = () => {
		navigation.goBack();
	};

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			await Promise.all([
				fetchFollowerCount(),
				fetchFollowingCount(),
				fetchPostCount(),
				fetchBio(),
			]);
		} catch (error) {
			console.error('Error refreshing:', error);
		} finally {
			setRefreshing(false);
		}
	};

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<View style={styles.backButtonContainer}>
				<TouchableOpacity onPress={handleBackNavigation}>
					<Ionicons name="arrow-back" size={20} style={styles.icon} />
				</TouchableOpacity>
				<TouchableOpacity onPress={handleBackNavigation}>
					<Text style={styles.backButton}>Back</Text>
				</TouchableOpacity>
			</View>
			<Image source={{ uri: user.profilePhotoUrl }} style={styles.profilePic} />
			<Text style={styles.username}>{user.username}</Text>
			{/* Display other user information as needed */}
			{user.userId !== firebase.getCurrentUser().uid && (
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
			)}
			<View style={styles.ffContainer}>
				<View>
					<Text style={styles.count}>{followersCount}</Text>
					<Text>Followers</Text>
				</View>
				<View>
					<Text style={styles.count}>{followingCount}</Text>
					<Text>Following</Text>
				</View>
				<View>
					<Text style={styles.count}>{21}</Text>
					<Text>Books</Text>
				</View>
				<View>
					<Text style={styles.count}>{postCount}</Text>
					<Text>Posts</Text>
				</View>
			</View>
			<TextInput
				multiline
				numberOfLines={4}
				placeholder="Start typing to write your bio!"
				value={bio}
				editable={false}
				style={styles.bio}
				onChangeText={setBio}
			></TextInput>
			<Carousel
				carouselData={booksReadTitles}
				carouselTitle="Books Read"
				showMore={showMore}
				toggleShowMore={() => setShowMore(!showMore)}
				toggleModal={toggleModal}
				posts={false}
				titles={true}
				isMyProfile={false}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	backButtonContainer: {
		position: 'absolute',
		top: 20,
		left: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		fontSize: 16,
		fontWeight: 'bold',
		// color: 'blue',
		marginLeft: 5,
		marginRight: 5,
	},
	profilePic: {
		marginTop: 20,
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
	ffContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '80%',
		marginBottom: 20,
		marginTop: 10,
	},
	count: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	bio: {
		width: '95%',
		padding: 10,
		fontSize: 18,
		minHeight: 90,
		maxHeight: 90,
		marginBottom: 5,
		marginTop: 20,
		borderWidth: 0,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
});

export default SecondaryProfileScreen;
