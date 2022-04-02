import React, { useCallback, useEffect, useState } from 'react';
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	ToastAndroid,
	Dimensions,
	Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollWrapper } from '../../common/components/scroll-wrapper/scroll-wrapper.component';
import { Button, FAB, Portal } from 'react-native-paper';
import {
	useFocusEffect,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { ViewsEnum } from '../../common/enums/views.enum';
import { DraftData } from '../../common/models/draft-types.type';
import { useHeight } from '../../common/hooks/use-height.hook';
import { useApp } from '../../app.context';
import { ClubsEnum } from '../../common/enums/clubs.enum';

type Props = {
	navigation: any;
};
type Navigation = Props['navigation'];

export const HomeView: React.FC<Props> = () => {
	const WislaPlockActions = [
		{
			icon: 'plus',
			label: 'Nowy draft pojedyńczy',
			onPress: () => onNewDraft(ViewsEnum.WISLA_PLOCK_SINGULAR_FORM_VIEW)
		},
		{
			icon: 'plus',
			label: 'Nowy draft wielokrotny',
			onPress: () => onNewDraft(ViewsEnum.WISLA_PLOCK_MULTIPLE_FORM_VIEW)
		}
	];

	const createActions = () => {
		let actions: any[] = [
			{
				icon: 'delete',
				label: 'Wyczyść',
				onPress: deleteAll
			}
		];

		if (hasAccessToForms(ClubsEnum.WISLA_PLOCK))
			actions = actions.concat(WislaPlockActions);

		if (hasAccessToForms(ClubsEnum.TEST)) actions.push(...test);

		return actions;
	};

	const test = [
		{
			icon: 'plus',
			label: 'Nowy TEST',
			onPress: () => onNewDraft(ViewsEnum.TEST)
		}
	];

	const [drafts, setDrafts] = useState<string[]>([]);
	const [fabOpen, setFabOpen] = useState(false);
	const [draftToDelete, setDraftToDelete] = useState('');

	const height = useHeight();

	const { hasAccessToForms } = useApp();

	const onStateChange = ({ open }: any) => setFabOpen(open);

	const navigation = useNavigation<Navigation>();

	const getAllDrafts = async () => {
		try {
			const allDrafts = await AsyncStorage.getAllKeys();
			setDrafts(allDrafts);
		} catch (e) {
			console.log(e);
		}
	};

	useFocusEffect(
		useCallback(() => {
			getAllDrafts();
		}, [])
	);

	const onDraftPress = async (draftKey: string) => {
		const draft: DraftData = JSON.parse(
			(await AsyncStorage.getItem(draftKey)) as string
		);

		const { type } = draft;

		navigation.navigate(type, { draft });
	};

	const onNewDraft = (draftType: ViewsEnum) => {
		navigation.navigate(draftType);
	};

	const deleteAll = async () => {
		await AsyncStorage.multiRemove(drafts);
		setDrafts([]);
		ToastAndroid.show('Usunięto wszystkie drafty', 2000);
	};

	const deleteDraft = (draftKey: string) => {
		AsyncStorage.removeItem(draftKey);
		setDrafts(drafts.filter((d) => d !== draftKey));
	};

	const onLongPress = (draftKey: string) => {
		Alert.alert('Usunąć?', `Czy na pewno chcesz usunąć draft ${draftKey}?`, [
			{
				text: 'Tak',
				style: 'destructive',
				onPress: () => deleteDraft(draftKey)
			},
			{
				text: 'Nie',
				style: 'cancel',
				onPress: () => {}
			}
		]);
	};

	return (
		<View style={{ height }}>
			<ScrollWrapper>
				<View style={{ height }}>
					{drafts.map((d) => (
						<Button
							onPress={() => onDraftPress(d)}
							onLongPress={() => onLongPress(d)}
							mode='contained'
							key={d}
							style={{
								margin: 5,
								padding: 5
							}}
						>
							{d}
						</Button>
					))}
				</View>
			</ScrollWrapper>
			<FAB.Group
				visible
				onStateChange={onStateChange}
				open={fabOpen}
				onPress={() => setFabOpen(!fabOpen)}
				style={styles.fab}
				icon='plus'
				actions={createActions()}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		left: 0,
		bottom: 60
	}
});
