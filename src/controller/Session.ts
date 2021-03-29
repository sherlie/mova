import { inject, injectable } from 'inversify';
import { EntryService } from '@service/EntryService';
import { LangService } from '@service/LangService';
import { Identifiers } from '@app/identifiers';
import { LangDataLoader } from './graphql/dataloaders/LangDataLoader';

@injectable()
export class Session {
    constructor(
        @inject(Identifiers.LangService)
        public langService: LangService,

        @inject(Identifiers.LangDataLoader)
        public langDataLoader: LangDataLoader,

        @inject(Identifiers.EntryService)
        public entriesService: EntryService,
    ) {}
}
