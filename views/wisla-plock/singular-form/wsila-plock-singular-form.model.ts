import { ViewsEnum } from '../../../common/enums/views.enum';

export interface WislaPlockSingularFormValues {
	type: ViewsEnum.WISLA_PLOCK_SINGULAR_FORM_VIEW;
	scout: string;
	fixtureDate: Date;
	weather: string;
	fixture: string;
	fixtureLevel: string;
	player: string;
	club: string;
	teamComposition: string;

	position: string;
	age: string;
	height: string;
	weight: string;
	bodyType: string;
	firstChoice: string;
	secondChoice: string;
	thirdChoice: string;
	leg: string;
	playerProfile: string;

	mentalTraits: {
		postLossBehavior: string;
		communication: string;
		diligence: string;
		courage: string;
		creativity: string;
		determination: string;
		leadership: string;
		takeoverAggression: string;
		cunningness: string;
		decisionMaking: string;
	};

	physicalTraits: {
		speed: string;
		jumpiness: string;
		agility: string;
		startSpeed: string;
	};

	technicalTraits: {
		overallScore: string;
		category: string;
	};
	summary: string;
}
