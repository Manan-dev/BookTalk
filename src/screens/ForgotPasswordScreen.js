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
import { FirebaseContext } from '../context/FirebaseContext';

export default function ForgotPasswordScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const firebase = React.useContext(FirebaseContext);

	const handleResetPassword = async () => {
		setLoading(true);
		setMessage(null);

		try {
			await firebase.resetPassword(email);
			setMessage('Password reset email sent. Check your inbox.');
		} catch (error) {
			setMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.titleText}>Forgot Password</Text>
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
				</View>
			</View>
			{loading ? (
				<Button
					buttonStyle={styles.resetPasswordButton}
					loading
					disabled={true}
				></Button>
			) : (
				<Button
					buttonStyle={styles.resetPasswordButton}
					onPress={handleResetPassword}
				>
					Reset Password
				</Button>
			)}
			{message && <Text style={styles.message}>{message}</Text>}
			<TouchableOpacity
				style={styles.backToSigninLink}
				onPress={() => navigation.goBack()}
			>
				<Text
					style={{
						color: 'rgb(67, 135, 214)',
						textDecorationLine: 'underline',
					}}
				>
					Back to Sign In
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
	resetPasswordButton: {
		width: '80%',
		borderRadius: 10,
		alignSelf: 'center',
		marginTop: 20,
	},
	message: {
		alignSelf: 'center',
		marginTop: 10,
		color: 'green',
	},
	backToSigninLink: {
		alignSelf: 'center',
		marginTop: 10,
	},
});
