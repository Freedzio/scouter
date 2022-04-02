import React from 'react';
import { Text, View } from 'react-native';
import { useApp } from '../../app.context';
import { ClubsEnum } from '../enums/clubs.enum';

type Props = {
	club: ClubsEnum;
};

export const DraftUnavailable: React.FC<Props> = ({ children, club }) => {
	const { hasAccessToForms } = useApp();

	return hasAccessToForms(club) ? (
		<>{children}</>
	) : (
		<View>
			<Text>Ten formularz jest niedostępny</Text>
		</View>
	);
};
