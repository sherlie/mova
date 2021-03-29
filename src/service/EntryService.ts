import { Entry } from '@model/Entry';
import { LangId } from '@model/Lang';
import { injectable } from 'inversify';

export interface EntryScope {
    langId: LangId;
}

export interface EntryService {
    getAll(scope: EntryScope): Promise<Entry[]>;
}

@injectable()
export class EntryServiceImpl implements EntryService {
    getAll(scope: EntryScope): Promise<Entry[]> {
        console.log(scope);
        throw new Error('Method not implemented.');
    }
}
