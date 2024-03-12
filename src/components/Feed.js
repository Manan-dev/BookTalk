import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import Post from './Post';

const Feed = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [postLikeState, setPostLikeState] = useState({});
	const [user, _] = React.useContext(UserContext);
	const firebase = React.useContext(FirebaseContext);
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState({});
	const [newComment, setNewComment] = useState('');
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const fetchedPosts = await firebase.getAllPosts();
				setPosts(fetchedPosts);
				const commentsObj = {};
				fetchedPosts.forEach(post => {
					commentsObj[post.id] = post.comments || [];
				});
				setComments(commentsObj);
			} catch (error) {
				console.error('Error fetching posts:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	const toggleLike = postId => {
		setPostLikeState(prevState => ({
			...prevState,
			[postId]: !prevState[postId] || false,
		}));
	};

	const ellipsisClicked = item => {
		setSelectedPost(item);
		setModalVisible(true);
	};

	const addComment = (postId, newComment) => {
		if (!newComment) return;
		setComments(prevComments => ({
			...prevComments,
			[postId]: [...(prevComments[postId] || []), newComment],
		}));
	};

	const addCommentModal = async item => {
		setSelectedPost(item);
		setCommentModalVisible(true);
	};

	const hideCommentModal = () => {
		setCommentModalVisible(false);
	};

	const renderItem = ({ item }) => (
		<Post
			item={item}
			toggleLike={toggleLike}
			ellipsisClicked={ellipsisClicked}
			addCommentModal={addCommentModal}
			commentModalVisible={commentModalVisible}
			hideCommentModal={hideCommentModal}
			selectedPost={selectedPost}
			newComment={newComment}
			setNewComment={setNewComment}
			addComment={addComment}
			comments={comments[item.id]}
			user={user}
			postLikeState={postLikeState}
		/>
	);

	const hideModal = () => {
		setModalVisible(false);
	};

	const renderDropdownOptions = () => (
		<View style={styles.dropdownContainer}>
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

	if (loading) {
		return (
			<View
				style={{
					display: 'flex',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Image
					source={require('../../assets/loadingPosts.gif')}
					style={{ width: 50, height: 50 }}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={posts}
				keyExtractor={item => item.id}
				renderItem={renderItem}
			/>
			<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
				{renderDropdownOptions()}
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
});

export default Feed;
