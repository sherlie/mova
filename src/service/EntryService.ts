import { Identifiers } from '@app/identifiers';
import { CustomDef, CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { Entry, EntryId, PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CustomValueWithoutDef, EntryRepo, EntryWithoutCustomDefs } from '@repository/EntryRepo';
import { mapPage, Page, PageScope } from '@repository/paging';
import { inject, injectable } from 'inversify';
import { CustomDefService } from './CustomDefService';
import { CustomValue, TextCustomValue } from '@model/CustomValue';
import { Maybe } from '@util/types';
import { EntryFactory } from './EntryFactory';

export interface EntryScope extends PageScope {
    langId: LangId;
}

export interface CreateEntry {
    original: string;
    translation: string;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    customValues?: Record<CustomId, SaveCustomValue>;
}

export interface UpdateEntry {
    id: EntryId;
    original?: string;
    translation?: string;
    customValues?: Record<CustomId, SaveCustomValue>;
}

export interface SaveCustomValue {
    text?: string;
    option?: OptionId;
    options?: OptionId[];
    table?: Record<TableCellId, string>;
}

export interface EntryService {
    getAll(scope: EntryScope): Promise<Page<Entry>>;
    getById(entryId: EntryId): Promise<Entry>;
    getByIds(entryIds: EntryId[]): Promise<Map<EntryId, Entry>>;
    create(createEntry: CreateEntry): Promise<Entry>;
    update(updateEntry: UpdateEntry): Promise<Entry>;
    delete(entryId: EntryId): Promise<Entry>;
}

const ERR_ENTRY_NOT_FOUND = 'Entry not found';

@injectable()
export class EntryServiceImpl implements EntryService {
    constructor(
        @inject(Identifiers.EntryRepo) private entryRepo: EntryRepo,
        @inject(Identifiers.EntryFactory) private entryFactory: EntryFactory,
        @inject(Identifiers.CustomDefService) private customDefService: CustomDefService,
    ) {}

    async getAll(scope: EntryScope): Promise<Page<Entry>> {
        const entries = await this.entryRepo.getAll(scope);

        return mapPage(entries, (entry) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { customValues, ...entryWithoutCustomValues } = entry;
            return entryWithoutCustomValues;
        });
    }

    async getById(entryId: EntryId): Promise<Entry> {
        const entry = await this.entryRepo.getById(entryId);
        if (!entry) {
            throw this.buildInvalidEntryIdsError([entryId]);
        }

        return (await this.withEntriesCustomDefs([entry]))[0];
    }

    async getByIds(entryIds: EntryId[]): Promise<Map<EntryId, Entry>> {
        const entriesWithotCustomDefs = await this.entryRepo.getByIds(entryIds);
        const entries = await this.withEntriesCustomDefs(entriesWithotCustomDefs);
        const entriesMap = new Map<EntryId, Entry>(entries.map((entry) => [entry.id, entry]));

        const invalidEntryIds = entryIds.filter((entryId) => !entriesMap.has(entryId));
        if (invalidEntryIds.length) {
            throw this.buildInvalidEntryIdsError(invalidEntryIds);
        }

        return entriesMap;
    }

    async create(createEntry: CreateEntry): Promise<Entry> {
        const entry = await this.entryFactory.build(createEntry);
        await this.entryRepo.create(entry);

        return entry;
    }

    async update(updateEntry: UpdateEntry): Promise<Entry> {
        const entry = await this.getById(updateEntry.id);
        const updatedEntry = await this.entryFactory.buildUpdated(entry, updateEntry);
        await this.entryRepo.update(updatedEntry);
        return updatedEntry;
    }

    async delete(entryId: EntryId): Promise<Entry> {
        const entry = await this.getById(entryId);
        await this.entryRepo.delete(entryId);
        return entry;
    }

    private async withEntriesCustomDefs(entries: EntryWithoutCustomDefs[]): Promise<Entry[]> {
        const entryCustomMaps = new Map<EntryId, Map<CustomId, CustomValueWithoutDef>>(
            entries
                .filter((entry) => entry.customValues)
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                .map((entry) => [entry.id, entry.customValues!]),
        );
        const customDefIds: CustomId[] = Array.from(entryCustomMaps.values()).flatMap((customMap) =>
            Array.from(customMap.keys()),
        );
        const customDefsMap = await this.customDefService.getByIds(customDefIds);

        return entries.map((entry) => ({
            ...entry,
            customValues: this.withEntryCustomDefs(entry.customValues, customDefsMap),
        }));
    }

    private withEntryCustomDefs(
        customValues: Maybe<Map<CustomId, CustomValueWithoutDef>>,
        customDefs: Map<CustomId, CustomDef>,
    ): Maybe<Map<CustomId, CustomValue>> {
        if (!customValues) {
            return;
        }

        return new Map<CustomId, CustomValue>(
            Array.from(customValues).map(([customId, customValue]) => [
                customId,
                {
                    ...(customValue as TextCustomValue),
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    definition: customDefs.get(customId)!,
                } as CustomValue,
            ]),
        );
    }

    private buildInvalidEntryIdsError(invalidEntryIds: EntryId[]): Error {
        const invalidEntryIdsFormatted = invalidEntryIds
            .map((entryId) => `[${entryId}]`)
            .join(', ');

        return new Error(`${ERR_ENTRY_NOT_FOUND}: ${invalidEntryIdsFormatted}`);
    }
}
