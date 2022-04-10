import { WislaPlockMultipleFormValues } from '../../views/wisla-plock/multiple-form/wisla-plock-multiple-form.model';
import { WislaPlockSingularFormValues } from '../../views/wisla-plock/singular-form/wsila-plock-singular-form.model';

export type WislaPlockDrafts =
	| WislaPlockSingularFormValues
	| WislaPlockMultipleFormValues;

export type DraftData = WislaPlockDrafts;
