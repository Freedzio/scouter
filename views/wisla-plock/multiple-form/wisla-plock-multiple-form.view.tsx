import React, { useEffect, useState } from 'react';
import { LabeledInput } from '../../../common/components/labeled-input.component';
import { View, Platform, ToastAndroid } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { WislaPlockMultipleFormValues } from './wisla-plock-multiple-form.model';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMultipleReportWislaPlock } from './wisla-plock-create-multiple-report';
import dayjs from 'dayjs';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { useApp } from '../../../app.context';
import { ScrollWrapper } from '../../../common/components/scroll-wrapper/scroll-wrapper.component';
import { ViewsEnum } from '../../../common/enums/views.enum';
import { getDraftKey } from '../../../common/storage/get-draft-key';
import { DraftWrapper } from '../../../common/components/draft-wrapper.component';
import { ClubsEnum } from '../../../common/enums/clubs.enum';

type Props = {
	route: any;
	navigation: any;
};
type Route = Props['route'];
type Navigation = Props['navigation'];

export const WislaPlockMultipleFormView: React.FC<Props> = () => {
	const { handleUpload, saveDraft, deleteDraft } = useApp();

	const [datepickerOpen, setDatepickerOpen] = useState(false);
	const [prevDate, setPrevDate] = useState<Date>();
	const [prevFixture, setPrevFixture] = useState<string>();

	const [loading, setLoading] = useState(false);

	const route = useRoute<Route>();
	const draft = route.params?.draft;

	const { control, watch, setValue, handleSubmit } =
		useForm<WislaPlockMultipleFormValues>({
			defaultValues: draft ?? {
				fixtureDate: new Date(),
				type: ViewsEnum.WISLA_PLOCK_MULTIPLE_FORM_VIEW,
				homeTeam: {
					observedPlayers: [{}, {}, {}]
				},
				awayTeam: {
					observedPlayers: [{}, {}, {}]
				}
			}
		});

	const values = watch();

	const navigation = useNavigation<Navigation>();
	const goHome = () => navigation.navigate(ViewsEnum.HOME_VIEW);

	const onSubmit = async (values: WislaPlockMultipleFormValues) => {
		try {
			setLoading(true);

			const report = await createMultipleReportWislaPlock(values);

			handleUpload(report, getDraftKey(values), goHome);
		} catch (e) {
			ToastAndroid.show('Coś poszło nie tak', 5000);
		}
	};

	useEffect(() => {
		saveDraft(values);
		if (
			dayjs(prevDate).format('DD-MM-YYYY') !==
			dayjs(values.fixtureDate).format('DD-MM-YYYY')
		) {
			setPrevDate(values.fixtureDate);
			deleteDraft({ ...values, fixtureDate: prevDate as Date });
		}
		if (prevFixture !== values.fixture) {
			deleteDraft({ ...values, fixture: prevFixture as string });
			setPrevFixture(values.fixture);
		}
	}, [values]);

	const createTabsForTeam = (team: 'home' | 'away') => {
		return values[`${team}Team`].observedPlayers.map((player, index) => (
			<TabScreen label={`${team} ${index}`} key={`${team}${index}`}>
				<View>
					<LabeledInput
						multiline={false}
						label='Imię i nazwisko'
						name={`${team}Team.observedPlayers[${index}].name`}
						control={control}
					/>
					<LabeledInput
						multiline={false}
						label='Pozycja'
						name={`${team}Team.observedPlayers[${index}].position`}
						control={control}
					/>
					<LabeledInput
						multiline={false}
						label='Rok urodzenia'
						name={`${team}Team.observedPlayers[${index}].birthYear`}
						control={control}
					/>
					<LabeledInput
						multiline={false}
						label='Ocena występu (skala 1-5)'
						name={`${team}Team.observedPlayers[${index}].overallScore`}
						control={control}
						numeric
					/>
					<LabeledInput
						multiline={false}
						label='Kategoria'
						name={`${team}Team.observedPlayers[${index}].category`}
						control={control}
					/>
					<LabeledInput
						multiline={false}
						label='Krótki opis'
						name={`${team}Team.observedPlayers[${index}].summary`}
						control={control}
					/>
					<Button
						disabled={
							values.homeTeam.observedPlayers.length +
								values.awayTeam.observedPlayers.length ===
							2
						}
						onPress={() => removePlayer(team, index)}
						mode='contained'
					>
						Usuń zawodnika
					</Button>
				</View>
			</TabScreen>
		));
	};

	const createTabs = () => {
		return [...createTabsForTeam('home'), ...createTabsForTeam('away')];
	};

	const addPlayer = (team: 'home' | 'away') => {
		setValue(`${team}Team.observedPlayers`, [
			...values[`${team}Team`].observedPlayers,
			{
				name: '',
				category: '',
				birthYear: '',
				overallScore: '',
				summary: '',
				position: ''
			}
		]);
	};

	const removePlayer = (team: 'home' | 'away', index: number) => {
		setValue(
			`${team}Team.observedPlayers`,
			values[`${team}Team`].observedPlayers.filter((x, i) => i !== index)
		);
	};

	return (
		<DraftWrapper club={ClubsEnum.WISLA_PLOCK}>
			<ScrollWrapper loading={loading}>
				<LabeledInput control={control} label='Skaut' name='scout' />
				<LabeledInput
					control={control}
					label='Obserwowany mecz'
					name='fixture'
				/>
				<LabeledInput
					control={control}
					label='Warunki pogodowe'
					name='weather'
				/>
				<Button
					onPress={() => setDatepickerOpen(true)}
					style={{ paddingVertical: 10 }}
					mode='contained'
				>
					{dayjs(values.fixtureDate).format('DD-MM-YYYY')}
				</Button>
				{datepickerOpen && (
					<Controller
						control={control}
						name='fixtureDate'
						render={({ field: { value } }) => (
							<DateTimePicker
								value={new Date(value)}
								mode='date'
								onChange={(event: any, selectedDate: any) => {
									setDatepickerOpen(Platform.OS === 'ios');
									setValue('fixtureDate', selectedDate);
								}}
								display='default'
							/>
						)}
					/>
				)}
				<LabeledInput
					label='Poziom rozgrywkowy'
					name='fixtureLevel'
					control={control}
				/>
				<LabeledInput
					label='Drużyna gospodarzy - system gry'
					name='homeTeam.system'
					control={control}
				/>
				<LabeledInput
					label='Drużyna gości - system gry'
					name='awayTeam.system'
					control={control}
				/>
				<View style={{ flexDirection: 'row' }}>
					<Button
						onPress={() => addPlayer('home')}
						style={{ flex: 1, margin: 10 }}
						mode='contained'
					>
						Dodaj home
					</Button>
					<Button
						onPress={() => addPlayer('away')}
						style={{ flex: 1, margin: 10 }}
						mode='contained'
					>
						Dodaj away
					</Button>
				</View>
				<View style={{ minHeight: 650 }}>
					<Tabs showLeadingSpace={false} mode='scrollable'>
						{createTabs()}
					</Tabs>
				</View>
				<LabeledInput
					label='Dodatkowe notatki / uwagi'
					name='additionalNotes'
					control={control}
				/>

				<Button
					mode='contained'
					style={{ paddingVertical: 10, marginBottom: 10 }}
					onPress={handleSubmit(onSubmit)}
				>
					Utwórz
				</Button>
			</ScrollWrapper>
		</DraftWrapper>
	);
};
