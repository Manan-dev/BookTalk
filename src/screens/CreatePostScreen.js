import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import SearchModal from '../components/SearchModal'; // Import the SearchModal component
import { FirebaseContext } from '../context/FirebaseContext';

export default function CreatePostScreen() {
	const [postText, setPostText] = useState('');
	const [media, setMedia] = useState('');
	const [selectedBook, setSelectedBook] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const navigation = useNavigation();
	const firebase = useContext(FirebaseContext);

	const handlePost = async () => {
		navigation.goBack();
		await firebase.addPostForCurrentUser(postText, mergedResults);
		setPostText('');
		setMedia('');
		setSelectedBook(null);
	};

	const handleCancel = () => {
		navigation.goBack();
		setPostText('');
		setMedia('');
		setSelectedBook(null);
	};

	const handleAddMedia = async () => {
		try {
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permissionResult.granted) {
				alert('Permission to access media library is required!');
				return;
			}

			const pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				aspect: [4, 3],
				quality: 1,
			});

			if (!pickerResult.canceled) {
				const selectedAsset = pickerResult.assets[0];
				const mediaUri = selectedAsset.uri;
				setMedia(mediaUri);
			}
		} catch (error) {
			console.error('Error picking media:', error);
		}
	};

	const handleBookSelect = book => {
		setSelectedBook(book);
		setIsModalVisible(false);
	};

	const openModal = () => {
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	const mergedResults = [
		...(selectedBook ? [{ book: selectedBook.thumbnail }] : []),
		{ imageURL: media },
	];

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.headerButton} onPress={handleCancel}>
					<Text style={styles.headerButtonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerButton} onPress={handlePost}>
					<Text style={styles.headerButtonText}>Post</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.inputContainer}>
				<View style={styles.inputBox}>
					<TextInput
						style={styles.input}
						placeholder="Write your post here..."
						onChangeText={text => setPostText(text)}
						value={postText}
						multiline
					/>
					<TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
						<Ionicons name="image-outline" size={24} color="white" />
					</TouchableOpacity>
					<TouchableOpacity onPress={openModal} style={styles.searchButton}>
						<Ionicons name="search" size={24} color="white" />
						<Text style={styles.searchButtonText}> Search for Books</Text>
					</TouchableOpacity>
				</View>
				<ScrollView horizontal>
					{mergedResults.map((item, index) => {
						return (
							<TouchableOpacity key={index} onPress={() => console.log(item)}>
								{item.imageURL ? (
									<Image
										source={{ uri: item.imageURL }}
										style={styles.mediaPreview}
									/>
								) : item.book ? (
									<Image
										source={{ uri: item.book }}
										style={styles.mediaPreview}
									/>
								) : null}
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
			<SearchModal
				visible={isModalVisible}
				onClose={closeModal}
				onBookSelect={handleBookSelect}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	headerButton: {
		padding: 10,
		borderRadius: 20,
	},
	headerButtonText: {
		fontSize: 16,
		color: '#fff',
		backgroundColor: '#E9446A',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	inputContainer: {
		paddingHorizontal: 20,
		flex: 1,
	},
	inputBox: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		height: 300,
	},
	input: {
		fontSize: 18,
		minWidth: '98%',
	},
	mediaButton: {
		backgroundColor: '#E9446A',
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
		position: 'absolute',
		bottom: 0,
		left: 10,
	},
	searchButton: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		color: '#fff',
		borderRadius: 20,
		backgroundColor: '#E9446A',
		paddingVertical: 10,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
	},
	searchButtonText: {
		fontSize: 16,
		color: '#fff',
	},
	mediaPreview: {
		bottom: -10,
		left: 10,
		width: 120,
		height: 200,
		borderRadius: 10,
		marginRight: 10,
	},
});
