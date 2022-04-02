import { ViewsEnum } from '../../../common/enums/views.enum';

export interface WislaPlockMultipleFormValues {
	type: ViewsEnum.WISLA_PLOCK_MULTIPLE_FORM_VIEW;
	scout: string;
	fixture: string;
	weather: string;
	fixtureDate: Date;

	fixtureLevel: string;
	homeTeam: Team;
	awayTeam: Team;

	additionalNotes: string;
}
export interface Player {
	name: string;
	position: string;
	birthYear: string;
	overallScore: string;
	category: string;
	summary: string;
}

export interface Team {
	system: string;
	observedPlayers: Player[];
}
