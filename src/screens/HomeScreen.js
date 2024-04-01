import React from 'react';
import { StyleSheet, View } from 'react-native';
import Feed from '../components/Feed';

export default function Home() {
	return (
		<View style={styles.container}>
			<Feed />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
		backgroundColor: '#fff',
	},
});
