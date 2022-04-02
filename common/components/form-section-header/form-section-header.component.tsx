import React from 'react';
import { Text } from 'react-native';

type Props = {
	title: string;
};

export const FormSectionHeader: React.FC<Props> = ({ title }) => {
	return <Text style={{ fontSize: 20, color: 'black' }}>{title}</Text>;
};
