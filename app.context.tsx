import { createContext, useContext } from 'react';
import { File } from 'docx';
import { DraftData } from './common/models/draft-types.type';
import { ClubsEnum } from './common/enums/clubs.enum';

export interface AppContext {
	authToken: string;
	expirationTimestamp: number;
	handleUpload: (
		doc: File,
		filename: string,
		goHome: () => void
	) => Promise<void>;
	backgroundStyle: { backgroundColor: any };
	saveDraft: (data: DraftData) => void;
	deleteDraft: (data: DraftData) => void;
	hasAccessToForms: (club: ClubsEnum) => boolean;
}

const AppContext = createContext<AppContext | null>(null);

const AppProvider = AppContext.Provider;
const useApp = (): AppContext => useContext(AppContext) as AppContext;

export { AppProvider, useApp };
