import * as Google from 'expo-auth-session/providers/google';
import * as GoogleSignIn from 'expo-google-sign-in';
import Constants from 'expo-constants';
import { Document, Packer } from 'docx';
import React, { useEffect, useState } from 'react';
import { ToastAndroid, Platform, Linking, Dimensions } from 'react-native';
import QueryString from 'qs';
import { WislaPlockSingularFormView } from './views/wisla-plock/singular-form/wisla-plock-singular-form.view';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { fetchGoogle } from './common/fetch-google/fetch-google';
import { endpoints } from './common/fetch-google/endpoints';
import { Base64 } from 'js-base64';
import dayjs from 'dayjs';
import { TokenResponse } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeView } from './views/home/home.view';
import { AppProvider } from './app.context';
import { DraftData } from './common/models/draft-types.type';
import { getDraftKey } from './common/storage/get-draft-key';
import { ViewsEnum } from './common/enums/views.enum';
import { UnauthorizedView } from './views/unauthorized/unauthorized.view';
import { ClubsEnum } from './common/enums/clubs.enum';
import { WislaPlockMultipleFormView } from './views/wisla-plock/multiple-form/wisla-plock-multiple-form.view';
import { deleteDraft } from './draft-handling/delete-draft';
import { saveDraft } from './draft-handling/save-draft';
import { uploadFile } from './draft-handling/upload-file';
import { UserStatusDto } from './common/models/user-status.dto';
import { TestView } from './views/test/test.view';
import { VeryfyingUserView } from './views/veryfying-user.view';

// labelki z forualrza i worda w jakiś enum wrzucić

const Stack = createNativeStackNavigator();

const App = () => {
	const [authorized, setAuthorized] = useState<boolean>();
	const [authToken, setAuthToken] = useState('');
	const [expirationTimestamp, setExpirationTimestamp] = useState(
		dayjs().unix()
	);

	const [clubs, setClubs] = useState<ClubsEnum[]>([]);
	const [error, setError] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: process.env.OAUTH_WEB_ID,
		iosClientId: process.env.OAUTH_IOS_ID,
		androidClientId: process.env.OAUTH_ANDROID_ID,
		scopes: ['https://www.googleapis.com/auth/drive.file']
	});

	const backgroundStyle = {
		backgroundColor: 'white'
	};

	const shouldAuth = () =>
		!Boolean(authToken) || !authorized || dayjs().unix() > expirationTimestamp;

	const checkUser = async (email: string) => {
		const apiResponse = await fetch(
			'https://scouter-web.herokuapp.com/api/check-user',
			{
				method: 'POST',
				body: JSON.stringify({ email }),
				headers: {
					'Content-Type': 'application/json',
					secret: process.env.API_SECRET as string
				}
			}
		);

		if (apiResponse.ok) {
			const status: UserStatusDto = await apiResponse.json();
			setAuthorized(status.active);
			setClubs(status.clubs);
		}
	};

	const login = async () => {
		let token = '';
		if (isExpo) {
			const authResponse = await promptAsync();

			if (authResponse.type === 'success') {
				ToastAndroid.show('Połączono z kontem Google', 5000);
				token = `${authResponse.authentication?.tokenType} ${authResponse.authentication?.accessToken}`;
				const { expiresIn } = authResponse.authentication as TokenResponse;

				const { email } = await fetchGoogle(endpoints.userInfo, token);

				await checkUser(email);

				setAuthToken(token);
				setExpirationTimestamp(dayjs().unix() + (expiresIn as number));
			} else {
				setAuthToken('');
				setAuthorized(false);
				ToastAndroid.show('Nie udało się połączyć z kontem Google', 5000);
			}
		} else {
			await GoogleSignIn.initAsync({
				scopes: ['https://www.googleapis.com/auth/drive.file'],
				clientId:
					Platform.OS === 'ios'
						? process.env.OAUTH_IOS_ID
						: process.env.OAUTH_ANDROID_ID
			});

			const authResponse = await GoogleSignIn.signInAsync();

			if (authResponse.type === 'success') {
				ToastAndroid.show('Połączono z kontem Google', 5000);
				token = `Bearer ${authResponse.user?.auth?.accessToken}`;

				const { email } = await fetchGoogle(endpoints.userInfo, token);

				await checkUser(email);

				setAuthToken(token);
				setExpirationTimestamp(
					authResponse.user?.auth?.accessTokenExpirationDate as number
				);
			} else {
				setAuthToken('');
				setAuthorized(false);
				ToastAndroid.show('Nie udało się połączyć z kontem Google', 5000);
			}
		}

		return token;
	};

	const isExpo = Constants.appOwnership === 'expo';

	const handleUpload = async (
		doc: Document,
		fileName: string,
		goHome: () => void
	) => {
		if (shouldAuth()) {
			const token = await login();
			uploadFile(doc as any, fileName, token, goHome);
		} else {
			uploadFile(doc as any, fileName, authToken, goHome);
		}
	};

	useEffect(() => {
		if ((!!request && isExpo) || !isExpo) login();
	}, [request]);

	const hasAccessToForms = (club: ClubsEnum) =>
		clubs.includes(club) || clubs.includes(ClubsEnum.ADMIN);

	const hasAccessToApp = authorized === true && clubs.length > 0;
	const shouldShowSpinner = authorized === undefined;

	return (
		<PaperProvider theme={{ ...DefaultTheme, dark: false }}>
			<AppProvider
				value={{
					handleUpload,
					saveDraft,
					deleteDraft,
					authToken,
					backgroundStyle,
					expirationTimestamp,
					hasAccessToForms
				}}
			>
				<StatusBar translucent={false} backgroundColor={'white'} />
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false
						}}
					>
						{shouldShowSpinner && (
							<Stack.Screen
								name={ViewsEnum.VERYFYING}
								component={VeryfyingUserView}
							/>
						)}
						{hasAccessToApp === false && (
							<Stack.Screen
								name={ViewsEnum.UNAUTHORIZED}
								component={UnauthorizedView}
							/>
						)}
						{hasAccessToApp === true && (
							<>
								<Stack.Screen name={ViewsEnum.HOME_VIEW} component={HomeView} />

								<Stack.Screen
									name={ViewsEnum.WISLA_PLOCK_SINGULAR_FORM_VIEW}
									component={WislaPlockSingularFormView}
								/>
								<Stack.Screen
									name={ViewsEnum.WISLA_PLOCK_MULTIPLE_FORM_VIEW}
									component={WislaPlockMultipleFormView}
								/>
								<Stack.Screen name={ViewsEnum.TEST} component={TestView} />
							</>
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</AppProvider>
		</PaperProvider>
	);
};

export default App;
