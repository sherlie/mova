import { Flavor } from '@util/flavor';
import { CustomValue } from './CustomValue';
import { LangId } from './Lang';

export type EntryId = Flavor<string, 'Entry'>;

export interface Entry {
    id: EntryId;
    original: string;
    translation: string;
    langId: LangId;
    pos: PartOfSpeech;
    custom?: CustomValue[];
}

export enum PartOfSpeech {
    Noun = 'noun',
    Verb = 'verb',
    Adj = 'adj',
    Adv = 'adv',
    Pron = 'pron',
    Aux = 'aux',
}
