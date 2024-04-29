import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
	// Define a function to open Gmail when the email address is pressed
	const handleEmailLink = emailAddress => {
		// Define the Gmail URL with the "to" parameter pre-filled with the recipient email address
		const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${emailAddress}`;

		// Open the Gmail URL in the browser
		Linking.openURL(gmailUrl);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.paragraph}>
				This app is designed to provide an interactive platform to connect
				readers. This app utilizes the following API:{' '}
				<Text
					onPress={() =>
						Linking.openURL(
							'https://developers.google.com/books/docs/v1/getting_started'
						)
					}
					style={styles.link}
				>
					Google Books API
				</Text>
			</Text>

			<Text> </Text>

			{/* Use the Text component to display the email addresses with onPress event handlers */}
			<View>
				<Text style={styles.heading}>Team</Text>
				<Text style={styles.paragraph}>• Manan Patel (Manager/Developer)</Text>
				<Text
					style={styles.emailLink}
					onPress={() => handleEmailLink('mpatel65@vols.utk.edu')}
				>
					mpatel65@vols.utk.edu
				</Text>
				<Text style={styles.paragraph}>• Riya Patel (Developer)</Text>
				<Text
					style={styles.emailLink}
					onPress={() => handleEmailLink('rpatel90@vols.utk.edu')}
				>
					rpatel90@vols.utk.edu
				</Text>
				<Text style={styles.paragraph}>• Tulsi Tailor (Developer)</Text>
				<Text
					style={styles.emailLink}
					onPress={() => handleEmailLink('ttailor@vols.utk.edu')}
				>
					ttailor@vols.utk.edu
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		flex: 1,
		backgroundColor: '#FFF',
	},
	paragraph: {
		fontSize: 17,
		lineHeight: 24,
		marginBottom: 10,
		textAlign: 'justify',
	},
	team: {
		fontSize: 17,
		lineHeight: 24,
		marginBottom: 10,
		textAlign: 'left',
	},
	heading: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	link: {
		color: '#007AFF',
	},
	emailLink: {
		color: '#007AFF',
		marginLeft: 25,
		fontSize: 17,
		lineHeight: 17,
		marginBottom: 7,
	},
});
