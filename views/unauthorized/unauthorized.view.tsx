import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useHeight } from '../../common/hooks/use-height.hook';
type Props = {};

export const UnauthorizedView: React.FC<Props> = () => {
	const height = useHeight();
	return (
		<View style={{ height, paddingHorizontal: 3 }}>
			<Text style={{ fontSize: 30, textAlign: 'center', marginVertical: 30 }}>
				Jeżeli widzisz ten komunikat, to prawdopodobnie:
			</Text>
			<Text style={{ fontSize: 20, marginHorizontal: 5, marginVertical: 10 }}>
				-nie zalogowałeś się przez konto Google
			</Text>
			<Text style={{ fontSize: 20, marginHorizontal: 5, marginVertical: 10 }}>
				-żaden z Twoich klubów nie ma aktualnie aktywowanej usługi korzystania
				ze Scoutera
			</Text>
			<Text style={{ fontSize: 20, marginHorizontal: 5, marginVertical: 10 }}>
				-Twoje konto zostało dezaktywowane
			</Text>
			<Text style={{ fontSize: 20, marginHorizontal: 5, marginVertical: 30 }}>
				Skontaktuj się ze swoim Klubem w celu rozwiązania tej sytuacji
			</Text>
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Avatar.Image
					size={140}
					style={{ marginTop: 90 }}
					source={require('../../assets/logo.png')}
				/>
			</View>
		</View>
	);
};
