import dayjs from 'dayjs';
import { DraftData } from '../models/draft-types.type';

export const getDraftKey = (data: DraftData) =>
	`${dayjs(data.fixtureDate).format('DD-MM-YYYY')} ${data.fixture}`;
