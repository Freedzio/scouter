import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { useApp } from '../../app.context';
import { ViewsEnum } from '../../common/enums/views.enum';
import { useHeight } from '../../common/hooks/use-height.hook';

type Props = {};

export const WelcomeView: React.FC<Props> = ({}) => {
	const height = useHeight();
	const navigation = useNavigation();

	const { login, handleOfflineMode } = useApp();

	const onLoginPress = () => {
		navigation.navigate(ViewsEnum.VERYFYING as any);

		login();
	};

	const onOfflinePress = () => handleOfflineMode();

	return (
		<View style={{ height, backgroundColor: 'white' }}>
			<Text
				style={{
					marginTop: '30%',
					fontSize: 80,
					fontWeight: 'bold',
					marginLeft: '5%'
				}}
			>
				Scouter
			</Text>

			<Image
				style={{ marginTop: 0, alignSelf: 'flex-end', marginRight: '10%' }}
				source={require('../../assets/logo.png')}
			/>

			<View style={{ marginTop: '30%' }}>
				<Button onPress={onLoginPress} mode='contained' style={buttonStyle}>
					Zaloguj się
				</Button>
				<Button onPress={onOfflinePress} mode='outlined' style={buttonStyle}>
					Kontynuuj offline
				</Button>
			</View>
		</View>
	);
};

const { buttonStyle } = StyleSheet.create({
	buttonStyle: {
		width: '50%',
		padding: 10,
		margin: 10,
		alignSelf: 'center'
	}
});
