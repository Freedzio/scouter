import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

type Props = {
	label: string;
	name: string;
	control: Control<any>;
	multiline?: boolean;
	numeric?: boolean;
};

export const LabeledInput: React.FC<Props> = ({
	label,
	name,
	control,
	multiline = true,
	numeric
}: Props) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange } }) => (
				<View style={{ marginBottom: 10 }}>
					<Text style={{ color: 'black' }}>{label}</Text>
					<TextInput
						keyboardType={numeric ? 'numeric' : 'default'}
						value={value}
						multiline={multiline}
						onChangeText={onChange}
						autoComplete
						mode='outlined'
					/>
				</View>
			)}
		/>
	);
};
