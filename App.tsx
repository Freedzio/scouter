import * as Google from 'expo-auth-session/providers/google';
import * as GoogleSignIn from 'expo-google-sign-in';
import Constants from 'expo-constants';
import { Document, Packer } from 'docx';
import React, { useEffect, useState } from 'react';
import {
	ToastAndroid,
	Platform,
	Linking,
	Dimensions,
	Alert
} from 'react-native';
import { WislaPlockSingularFormView } from './views/wisla-plock/singular-form/wisla-plock-singular-form.view';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { fetchGoogle } from './common/fetch-google/fetch-google';
import { endpoints } from './common/fetch-google/endpoints';
import dayjs from 'dayjs';
import { TokenResponse } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeView } from './views/home/home.view';
import { AppProvider } from './app.context';
import { ViewsEnum } from './common/enums/views.enum';
import { UnauthorizedView } from './views/unauthorized/unauthorized.view';
import { ClubsEnum } from './common/enums/clubs.enum';
import { WislaPlockMultipleFormView } from './views/wisla-plock/multiple-form/wisla-plock-multiple-form.view';
import { deleteDraft } from './draft-handling/delete-draft';
import { saveDraft } from './draft-handling/save-draft';
import { uploadFile } from './draft-handling/upload-file';
import { UserStatusDto } from './common/models/user-status.dto';
import { TestView } from './views/test/test.view';
import { VeryfyingUserView } from './views/veryfying/veryfying-user.view';
import { WelcomeView } from './views/welcome/welcome.view';
import { OFFLINE_CLUBS_KEY } from './common/offline-clubs.key';

// labelki z forualrza i worda w jakiś enum wrzucić

const Stack = createNativeStackNavigator();

const App = () => {
	const [authorized, setAuthorized] = useState<boolean>();
	const [offlineMode, setOfflineMode] = useState<boolean>();
	const [authToken, setAuthToken] = useState('');
	const [expirationTimestamp, setExpirationTimestamp] = useState(
		dayjs().unix()
	);

	const [clubs, setClubs] = useState<ClubsEnum[]>([]);
	// const [error, setError] = useState(false);

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
			await AsyncStorage.setItem(
				OFFLINE_CLUBS_KEY,
				JSON.stringify(status.clubs)
			);
			setClubs(status.clubs);
		}
	};

	const login = async () => {
		let token = '';
		// if (isExpo) {
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
			setOfflineMode(false);
			ToastAndroid.show('Nie udało się połączyć z kontem Google', 5000);
		}
		// } else {
		// 	await GoogleSignIn.initAsync({
		// 		scopes: ['https://www.googleapis.com/auth/drive.file'],
		// 		clientId:
		// 			Platform.OS === 'ios'
		// 				? process.env.OAUTH_IOS_ID
		// 				: process.env.OAUTH_ANDROID_ID
		// 	});

		// 	const authResponse = await GoogleSignIn.signInAsync();

		// 	if (authResponse.type === 'success') {
		// 		ToastAndroid.show('Połączono z kontem Google', 5000);
		// 		token = `Bearer ${authResponse.user?.auth?.accessToken}`;

		// 		const { email } = await fetchGoogle(endpoints.userInfo, token);

		// 		await checkUser(email);

		// 		setAuthToken(token);
		// 		setExpirationTimestamp(
		// 			authResponse.user?.auth?.accessTokenExpirationDate as number
		// 		);
		// 	} else {
		// 		setAuthToken('');
		// 		setAuthorized(false);
		// 		setOfflineMode(false);
		// 		ToastAndroid.show('Nie udało się połączyć z kontem Google', 5000);
		// 	}
		// }

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

			if (!!token) uploadFile(doc as any, fileName, token, goHome);
			else setAuthorized(false);
		} else {
			uploadFile(doc as any, fileName, authToken, goHome);
		}
	};

	const handleOfflineMode = async () => {
		const clubs = await AsyncStorage.getItem(OFFLINE_CLUBS_KEY);
		if (!!clubs) {
			setClubs(JSON.parse(clubs));
			setOfflineMode(true);
		} else {
			Alert.alert(
				'Brak zapamiętanych klubów',
				'Prawdopodobnie nie logowałeś się jeszcze do aplikacji'
			);
		}
	};

	const hasAccessToForms = (club: ClubsEnum) =>
		clubs.includes(club) || clubs.includes(ClubsEnum.ADMIN);

	const hasAccessToApp =
		(authorized === true || offlineMode === true) && clubs.length > 0;

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
					hasAccessToForms,
					login,
					handleOfflineMode
				}}
			>
				<StatusBar translucent={false} backgroundColor={'white'} />
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false
						}}
					>
						{hasAccessToApp === false && (
							<>
								{authorized !== false && (
									<>
										<Stack.Screen
											name={ViewsEnum.WELCOME}
											component={WelcomeView}
										/>
										<Stack.Screen
											name={ViewsEnum.VERYFYING}
											component={VeryfyingUserView}
										/>
									</>
								)}
								{authorized === false && (
									<Stack.Screen
										name={ViewsEnum.UNAUTHORIZED}
										component={UnauthorizedView}
									/>
								)}
							</>
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
