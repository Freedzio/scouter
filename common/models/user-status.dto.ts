import { ClubsEnum } from '../enums/clubs.enum';

export interface UserStatusDto {
	active: boolean;
	clubs: ClubsEnum[];
}
