import { Button, Input } from '@rneui/themed';
import React, { useState } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function SigninScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.titleText}>BookTalk</Text>
			<View style={styles.auth}>
				<View style={styles.authContainer}>
					<Input
						placeholder="Email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus={true}
						keyboardType="email-address"
						value={email}
						onChangeText={email => setEmail(email)}
					></Input>
					<Input
						placeholder="Password"
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={true}
						value={password}
						onChangeText={password => setPassword(password)}
					></Input>
				</View>
			</View>
			{loading ? (
				<Button
					buttonStyle={styles.signinButton}
					loading
					disabled={true}
				></Button>
			) : (
				<Button buttonStyle={styles.signinButton}>Sign in</Button>
			)}
			<TouchableOpacity
				style={styles.signup}
				onPress={() => navigation.navigate('Signup')}
			>
				<Text>
					Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
				</Text>
			</TouchableOpacity>

			<StatusBar barStyle="default" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	titleText: {
		marginTop: 100,
		alignSelf: 'center',
		fontSize: 30,
		fontWeight: 'bold',
	},
	auth: {},
	authContainer: {},
	signup: {
		marginTop: 10,
		alignItems: 'center',
	},
	signinButton: {
		width: '80%',
		borderRadius: 10,
		alignSelf: 'center',
	},
	signupLink: {
		fontWeight: 'bold',
		color: 'rgb(67, 135, 214)',
	},
});
