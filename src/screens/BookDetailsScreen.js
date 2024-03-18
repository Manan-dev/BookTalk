import React, {useState} from 'react';
import { Image, StyleSheet, ImageBackground, Text, View, ScrollView, Share, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Carousel from '../components/Carousel';

const BookDetailsScreen = ({ route }) => {
	const { title, author, cover, plot, review, rating } = route.params;
	const [isModalVisible, setModalVisible] = useState(false);
	
	console.log("bookdetails:", review)

	const addClicked = () => {
		setModalVisible(true);
	};

	const toggleModal = () => {
		setModalVisible1(!isModalVisible1);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Books Read')}
				>
					<Text>Books Read</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Favorite Mystery Books')}
				>
					<Text>Favorite Mystery Books</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('To Be Read')}
				>
					<Text>To Be Read</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this book: ${title}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                } else {
                    // Shared
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

	const StarRating = ({ rating, style }) => {
		// Function to round the rating to the nearest whole number
		const roundedRating = Math.round(rating); // Round to the nearest whole number

		// Function to generate stars based on the rating
		const renderStars = () => {
		  const fullStars = roundedRating; // Number of full stars
		  const emptyStars = 5 - fullStars; // Number of empty stars
	  
		  // Array to store star components
		  const stars = [];
	  
		  // Adding full stars
		  for (let i = 0; i < fullStars; i++) {
			stars.push(<Text key={i} style={{ fontSize: 24, color: 'gold' }}>★</Text>);
		  }
	  
		  // Adding empty stars
		  for (let i = 0; i < emptyStars; i++) {
			stars.push(<Text key={`empty-${i}`} style={{ fontSize: 24, color: 'gray' }}>☆</Text>);
		  }
	  
		  return stars;
		};
	  
		return (
		  <View style={[{ flexDirection: 'row' }, style]}>
			{renderStars()}
		  </View>
		);
	};
	
	return (
		<ScrollView contentContainerStyle={styles.container}>
			{/* Add share button to screen */}
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
				<View>
					<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
						{renderDropdownOptions()}
					</Modal>
				</View>
				<TouchableOpacity style={{marginRight: 310}} onPress={() => addClicked()}>
					<Text style={{ fontSize: 25, color: '#006ee6' }}>+</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{marginRight: 10}} onPress={onShare}>
					<Ionicons name="ios-share" size={26} color="#007AFF" />
				</TouchableOpacity>
        	</View>
			<View style={styles.container}>
				{/* Add background image */}
				<ImageBackground source={{ uri: cover }} style={styles.backgroundImage} imageStyle={{opacity:0.7}}>
					<View style={styles.imageContainer}>
						<Image source={{ uri: cover }} style={styles.coverImage} />
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.detailsContainer}>
							
						</View>
					</View>
				</ImageBackground>
			</View>

			{/* Add book details content */}
			<View style={styles.detailsContainer}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.author}>{`${author.first_name} ${author.last_name}`}</Text>
				<StarRating rating={rating}></StarRating>
			 	<Text style={styles.plot}>{plot}</Text>
			</View>
		
			<View>
				{/* Add reviews */}
				<Text>Reviews</Text>
				{review && (
				<View style={styles.reviewsContainer}>
					<View>
						<View style={styles.reviewContainer}>
							<Text style={styles.reviewName}>{review.name}</Text>
							<Text style={styles.reviewBody}>{review.body}</Text>
						</View>
					</View>
				</View>
				)}
			</View>

			<View>
				{/* Add more books by this author */}
				<Carousel
					carouselData={null}
					carouselTitle="More Books by This Author"
					showMore={null}
					toggleShowMore={null} 
					toggleModal={null}
					posts={false}
					titles={false}
					byAuthor={true}
					authorName={author}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
        flexGrow: 1,
    },
	modalContainer: {
		flexGrow: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
		alignSelf: 'flex-start',
		marginBottom: 350
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
	coverImage: {
		width: 200,
		height: 300,
		marginTop: 200,
	},
	detailsContainer: {
		alignItems: 'center',
		marginTop: 160,
		padding: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	author: {
		fontSize: 18,
		marginBottom: 5,
		textAlign: 'center',
	},
	plot: {
		fontSize: 16,
		textAlign: 'justify',
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	reviewsContainer: {

	},
	reviews: {

	}
});

export default BookDetailsScreen;
