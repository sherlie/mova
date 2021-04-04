import { inject, injectable } from 'inversify';
import { EntryService } from '@service/EntryService';
import { LangService } from '@service/LangService';
import { Identifiers } from '@app/identifiers';
import { LangDataLoader } from './graphql/dataloaders/LangDataLoader';
import { CustomDefService } from '@service/CustomDefService';
import { EntryDataLoader } from './graphql/dataloaders/EntryDataLoader';

@injectable()
export class Session {
    constructor(
        @inject(Identifiers.LangService)
        public langService: LangService,

        @inject(Identifiers.LangDataLoader)
        public langDataLoader: LangDataLoader,

        @inject(Identifiers.EntryService)
        public entryService: EntryService,

        @inject(Identifiers.EntryDataLoader)
        public entryDataLoader: EntryDataLoader,

        @inject(Identifiers.CustomDefService)
        public customDefService: CustomDefService,
    ) {}
}
