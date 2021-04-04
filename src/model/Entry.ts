import { Flavor } from '@util/flavor';
import { CustomId } from './CustomDef';
import { CustomValue } from './CustomValue';
import { LangId } from './Lang';

export type EntryId = Flavor<string, 'Entry'>;

export interface Entry {
    id: EntryId;
    original: string;
    translation: string;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    customValues?: Map<CustomId, CustomValue>;
}

export enum PartOfSpeech {
    Noun = 'noun',
    Verb = 'verb',
    Adj = 'adj',
    Adv = 'adv',
    Pron = 'pron',
    Aux = 'aux',
}
