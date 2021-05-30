import DataLoader from 'dataloader';
import { EntryId, Entry } from '@model/Entry';
import { Identifiers } from '@app/identifiers';
import { EntryService } from '@service/EntryService';
import { inject, injectable } from 'inversify';

@injectable()
export class EntryDataLoader extends DataLoader<EntryId, Entry> {
    constructor(
        @inject(Identifiers.EntryService)
        private entryService: EntryService,
    ) {
        super((entryIds) => this.batchLoad(entryIds));
    }

    private async batchLoad(entryIds: ReadonlyArray<EntryId>): Promise<Entry[]> {
        const entries = await this.entryService.getByIds([...entryIds]);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return entryIds.map((entryId) => entries.get(entryId)!);
    }
}
