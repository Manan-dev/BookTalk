import { Kings_400Regular, useFonts } from '@expo-google-fonts/kings';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
	Image,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

const CustomHeader = () => {
	const navigation = useNavigation();
	let [fontsLoaded] = useFonts({
		Kings_400Regular,
	});

	if (!fontsLoaded) {
		return null;
	}
	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity
				style={styles.logoButton}
				onPress={() => navigation.navigate('Home')}
			>
				<Image
					source={require('../../assets/logo.png')}
					style={{ width: 140, height: 40 }}
				/>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CustomHeader;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
	},
	logoButton: {
		width: '40%',
	},
});
