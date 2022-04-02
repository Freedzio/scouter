import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, Dimensions, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

type Props = {
	title?: string;
};

export const LoaderSpinner: React.FC<Props> = ({ title }) => {
	const { height } = Dimensions.get('window');

	const navigation = useNavigation();

	useEffect(() => {
		navigation.addListener('beforeRemove', (e) => {
			e.preventDefault();

			Alert.alert('Poczekaj', 'Trwa tworzenie i zapisywanie dokumentu', [
				{
					text: 'OK',
					style: 'default',
					onPress: () => {}
				}
			]);
		});
	}, [navigation]);

	return (
		<View style={{ height }}>
			<Text style={{ fontSize: 40, textAlign: 'center', marginVertical: 30 }}>
				{title ?? 'Zapisuję...'}
			</Text>
			<ActivityIndicator size={300} animating={true} />
		</View>
	);
};
