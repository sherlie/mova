import { Flavor } from '@util/flavor';

export type LangId = Flavor<string, 'Lang'>;

export interface Lang {
    id: LangId;
    name: string;
}
