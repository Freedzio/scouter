import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, ToastAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import { LabeledInput } from '../../../common/components/labeled-input.component';
import { WislaPlockSingularFormValues } from './wsila-plock-singular-form.model';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'expo-modules-core';
import { useApp } from '../../../app.context';
import { ScrollWrapper } from '../../../common/components/scroll-wrapper/scroll-wrapper.component';
import { getDraftKey } from '../../../common/storage/get-draft-key';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ViewsEnum } from '../../../common/enums/views.enum';
import { FormSectionHeader } from '../../../common/components/form-section-header/form-section-header.component';
import { createSingularReportWislaPlock } from './wisla-plock-create-singular-report';
import { ClubsEnum } from '../../../common/enums/clubs.enum';
import { DraftUnavailable } from '../../../common/components/draft-unavailable.view';
import { DraftWrapper } from '../../../common/components/draft-wrapper.component';

type Props = {
	route: any;
	navigation: any;
};
type Route = Props['route'];
type Navigation = Props['navigation'];

export const WislaPlockSingularFormView: React.FC<Props> = () => {
	const { handleUpload, saveDraft, deleteDraft, hasAccessToForms } = useApp();

	const [datepickerOpen, setDatepickerOpen] = useState(false);
	const [prevDate, setPrevDate] = useState<Date>();
	const [prevFixture, setPrevFixture] = useState<string>();

	const [loading, setLoading] = useState(false);

	const route = useRoute<Route>();
	const draft = route.params?.draft;

	const { control, handleSubmit, watch, setValue } =
		useForm<WislaPlockSingularFormValues>({
			defaultValues: draft ?? {
				fixtureDate: new Date(),
				type: ViewsEnum.WISLA_PLOCK_SINGULAR_FORM_VIEW
			}
		});

	const values = watch();

	const navigation = useNavigation<Navigation>();
	const goHome = () => navigation.navigate(ViewsEnum.HOME_VIEW);

	const onSubmit = async (values: WislaPlockSingularFormValues) => {
		try {
			setLoading(true);
			const report = await createSingularReportWislaPlock(values);

			handleUpload(report, getDraftKey(values), goHome);
		} catch (e) {
			ToastAndroid.show('Coś poszło nie tak', 5000);
			console.log(e);
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

	return (
		<DraftWrapper club={ClubsEnum.WISLA_PLOCK}>
			<ScrollWrapper loading={loading}>
				<LabeledInput control={control} name='scout' label='Skaut' />

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
					control={control}
					name='weather'
					label='Warunki pogodowe'
				/>
				<LabeledInput
					control={control}
					name='fixture'
					label='Obserwowany mecz'
				/>
				<LabeledInput
					control={control}
					name='fixtureLevel'
					label='Poziom rozgrywkowy'
				/>
				<LabeledInput
					control={control}
					name='player'
					label='Obserwowany zawodnik'
				/>
				<LabeledInput control={control} name='club' label='Klub zawodnika' />
				<LabeledInput
					control={control}
					name='teamComposition'
					label='Ustawienie drużyny'
				/>
				<LabeledInput control={control} name='position' label='Pozycja' />
				<LabeledInput
					control={control}
					name='age'
					label='Wiek (data urodzenia)'
				/>
				<LabeledInput control={control} name='height' label='Wzrost' />
				<LabeledInput control={control} name='weight' label='Waga' />
				<LabeledInput control={control} name='bodyType' label='Budowa ciała' />
				<LabeledInput
					control={control}
					name='firstChoice'
					label='Pozycja I wyboru'
				/>
				<LabeledInput
					control={control}
					name='secondChoice'
					label='Pozycja II wyboru'
				/>
				<LabeledInput
					control={control}
					name='thirdChoice'
					label='Pozycja III wyboru'
				/>
				<LabeledInput control={control} name='leg' label='Preferowana noga' />
				<LabeledInput
					control={control}
					name='playerProfile'
					label='Profil zawodnika (porównanie do kogoś z Ekstraklasy / europejskiej piłki'
				/>
				<FormSectionHeader title='CECHY MENTALNE' />
				<LabeledInput
					control={control}
					name='mentalTraits.postLossBehavior'
					label='Zachowanie po stracie piłki'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.communication'
					label='Komunikacja z resztą drużyny'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.diligence'
					label='Pracowitość'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.courage'
					label='Odwaga'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.creativity'
					label='Kreatywność'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.determination'
					label='Determinacja'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.leadership'
					label='Cechy przywódcze'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.takeoverAggression'
					label='Agresja w odbiorze piłki'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.cunningness'
					label='Doświadczenie boiskowe (cwaniactwo)'
				/>
				<LabeledInput
					control={control}
					name='mentalTraits.decisionMaking'
					label='Decyzyjność'
				/>

				<FormSectionHeader title='CECHY MOTORYCZNE' />
				<LabeledInput
					numeric
					control={control}
					name='physicalTraits.speed'
					label='Szybkość (skala 1-5)'
				/>
				<LabeledInput
					numeric
					control={control}
					name='physicalTraits.jumpiness'
					label='Skoczność (skala 1-5)'
				/>
				<LabeledInput
					numeric
					control={control}
					name='physicalTraits.agility'
					label='Zwrotność (skala 1-5)'
				/>
				<LabeledInput
					numeric
					control={control}
					name='physicalTraits.startSpeed'
					label='Szybkość startowa (skala 1-5)'
				/>
				<FormSectionHeader title='CECHY TECHNICZNE' />
				<LabeledInput
					control={control}
					name='technicalTraits.overallScore'
					label='Ocena występu (skala 1-5)'
				/>
				<LabeledInput control={control} name='category' label='Kategoria' />
				<LabeledInput
					control={control}
					name='summary'
					label='Krótki opis / podsumowanie'
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
