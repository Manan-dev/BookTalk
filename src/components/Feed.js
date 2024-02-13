import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';

const CommentSection = ({ comments }) => {
	return (
		<View>
			{comments.map((comment, index) => (
				<Text key={index}>{comment}</Text>
			))}
		</View>
	);
};

const Feed = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [postLikeState, setPostLikeState] = useState({}); // Track like state for each post

	const ellipsisClicked = item => {
		setSelectedPost(item);
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const toggleLike = postId => {
		setPostLikeState(prevState => ({
			...prevState,
			[postId]: !prevState[postId] || false,
		}));
	};

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				{/* <Text>
          {selectedPost?.username}
        </Text> */}
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Unfollow clicked')}
				>
					<Text>Unfollow</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Share clicked')}
				>
					<Text>Share</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const data = [
		{
			id: '1',
			username: 'user1',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the first post.',
		},
		{
			id: '2',
			username: 'user2',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the second post.',
		},
		{
			id: '3',
			username: 'user3',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the third post.',
		},
		// Add more posts as needed
	];

	const [comments, setComments] = useState({});
	const [newComment, setNewComment] = useState('');

	const addComment = (postId, newComment) => {
		setComments(prevComments => ({
			...prevComments,
			[postId]: [...(prevComments[postId] || []), newComment],
		}));
	};

	const renderItem = ({ item }) => (
		<View style={styles.postContainer}>
			<View style={styles.topContainer}>
				<View style={styles.userInfoContainer}>
					<Image
						source={require('../../assets/favicon.png')}
						style={styles.profilePic}
					/>
					<Text style={styles.username}>{item.username}</Text>
				</View>
				<View>
					<TouchableOpacity onPress={() => ellipsisClicked(item)}>
						<Ionicons name="ellipsis-horizontal" size={24} color="black" />
					</TouchableOpacity>
				</View>
			</View>
			<Image source={item.postImage} style={styles.postImage} />
			<View style={styles.heartButton}>
				<TouchableOpacity onPress={() => toggleLike(item.id)}>
					{postLikeState[item.id] ? (
						<Ionicons name="heart" size={32} color="red" />
					) : (
						<Ionicons name="heart-outline" size={32} color="black" />
					)}
				</TouchableOpacity>
			</View>
			<Text style={styles.caption}>{item.caption}</Text>
			<CommentSection comments={comments[item.id] || []} />
			<View style={styles.commentInputContainer}>
				<TextInput
					style={styles.commentInput}
					placeholder="Add a comment..."
					onChangeText={text => setNewComment(text)}
					value={newComment}
				/>
				<TouchableOpacity
					style={styles.commentButton}
					onPress={() => {
						addComment(item.id, newComment);
						setNewComment('');
					}}
				>
					<Text>Post</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={item => item.id}
				renderItem={renderItem}
			/>
			<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
				{renderDropdownOptions()}
			</Modal>
		</View>
	);
};

export default Feed;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	postContainer: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		padding: 8,
	},
	username: {
		fontWeight: 'bold',
	},
	postImage: {
		width: '100%',
		height: 300,
		borderRadius: 8,
		resizeMode: 'contain',
	},
	caption: {
		marginVertical: 8,
	},
	profilePic: {
		width: 50,
		height: 50,
		marginEnd: 8,
		borderRadius: 50,
		borderColor: '#000',
		borderWidth: 1,
	},
	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	topContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	heartButton: {
		position: 'absolute',
		bottom: 5,
		right: 20,
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	commentInputContainer: {
		display: 'flex',
		flexDirection: 'row',
		width: '80%',
		marginTop: 8,
	},
	commentInput: {
		borderWidth: 1,
		width: '80%',
		padding: 8,
	},
	commentButton: {
		borderWidth: 1,
		padding: 8,
		marginLeft: 8,
	},
});
