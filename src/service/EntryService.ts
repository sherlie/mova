import { Identifiers } from '@app/identifiers';
import { CustomDef, CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { Entry, EntryId, PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CustomValueWithoutDef, EntryRepo, EntryWithoutCustomDefs } from '@repository/EntryRepo';
import { Page, PageScope } from '@repository/paging';
import { Maybe } from '@util/types';
import { inject, injectable } from 'inversify';
import { CustomDefService } from './CustomDefService';
import { CustomValue, TextCustomValue } from '@model/CustomValue';
import { CustomValueFactory } from './CustomValueFactory';
import { v4 as uuidv4 } from 'uuid';

export interface EntryScope extends PageScope {
    langId: LangId;
}

export interface CreateEntry {
    original: string;
    translation: string;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    customValues?: Map<CustomId, CreateCustomValue>;
}

export interface CreateCustomValue {
    text?: string;
    singleOption?: OptionId;
    multiOption?: OptionId[];
    table?: CreateCustomValueTableCell[];
}

export interface CreateCustomValueTableCell {
    id: TableCellId;
    value: string;
}
export interface EntryService {
    getAll(scope: EntryScope): Promise<Page<Entry>>;
    getById(entryId: EntryId): Promise<Maybe<Entry>>;
    getByIds(entryIds: EntryId[]): Promise<Entry[]>;
    create(createEntry: CreateEntry): Promise<Entry>;
}

const ERR_INVALID_CUSTOM_DEFS_FOR_ENTRY =
    'Entry custom value definitions are not valid for the entry';

@injectable()
export class EntryServiceImpl implements EntryService {
    constructor(
        @inject(Identifiers.EntryRepo) private entryRepo: EntryRepo,
        @inject(Identifiers.CustomDefService) private customDefService: CustomDefService,
        @inject(Identifiers.CustomValueFactory) private customValueFactory: CustomValueFactory,
    ) {}

    async getAll(scope: EntryScope): Promise<Page<Entry>> {
        const { items: entries, hasMore } = await this.entryRepo.getAll(scope);

        return {
            items: await this.setEntriesCustomDefs(entries),
            hasMore,
        };
    }

    async getById(entryId: EntryId): Promise<Maybe<Entry>> {
        const entry = await this.entryRepo.getById(entryId);
        if (!entry) {
            return;
        }

        return (await this.setEntriesCustomDefs([entry]))[0];
    }

    async getByIds(entryIds: EntryId[]): Promise<Entry[]> {
        const entries = await this.entryRepo.getByIds(entryIds);

        return await this.setEntriesCustomDefs(entries);
    }

    async create(createEntry: CreateEntry): Promise<Entry> {
        const entry: Entry = {
            id: uuidv4(),
            original: createEntry.original,
            translation: createEntry.translation,
            langId: createEntry.langId,
            partOfSpeech: createEntry.partOfSpeech,
            customValues: await this.buildCustomValues(createEntry),
        };

        await this.entryRepo.create(entry);

        return entry;
    }

    private async setEntriesCustomDefs(entries: EntryWithoutCustomDefs[]): Promise<Entry[]> {
        const entryCustomMaps = new Map<EntryId, Map<CustomId, CustomValueWithoutDef>>(
            entries
                .filter((entry) => entry.customValues)
                .map((entry) => [entry.id, entry.customValues!]),
        );
        const customDefIds: CustomId[] = Array.from(entryCustomMaps.values()).flatMap((customMap) =>
            Array.from(customMap.keys()),
        );
        const customDefs = await this.customDefService.getByIds(customDefIds);
        const customDefsMap = new Map<CustomId, CustomDef>(
            customDefs.map((customDef) => [customDef.id, customDef]),
        );

        return entries.map((entry) => ({
            ...entry,
            customValues: this.setEntryCustomValuesCustomDefs(entry.customValues, customDefsMap),
        }));
    }

    private setEntryCustomValuesCustomDefs(
        customValues: Map<CustomId, CustomValueWithoutDef> | undefined,
        customDefs: Map<CustomId, CustomDef>,
    ): Map<CustomId, CustomValue> | undefined {
        if (!customValues) {
            return;
        }

        return new Map<CustomId, CustomValue>(
            Array.from(customValues).map(([customId, customValue]) => [
                customId,
                {
                    ...(customValue as TextCustomValue),
                    definition: customDefs.get(customId)!,
                } as CustomValue,
            ]),
        );
    }

    private async buildCustomValues(
        createEntry: CreateEntry,
    ): Promise<Map<CustomId, CustomValue> | undefined> {
        if (!createEntry.customValues || !createEntry.customValues.size) {
            return;
        }

        const customDefsMap = await this.getCustomDefs(Array.from(createEntry.customValues.keys()));

        const invalidCustomIdsForEntry = Array.from(customDefsMap.values())
            .filter(
                (customDef) =>
                    customDef.langId !== createEntry.langId ||
                    customDef.partOfSpeech !== createEntry.partOfSpeech,
            )
            .map((customDef) => customDef.id);
        if (invalidCustomIdsForEntry.length) {
            throw this.buildInvalidCustomIdsError(invalidCustomIdsForEntry);
        }

        const customValuesMap = new Map<CustomId, CustomValue>(
            Array.from(createEntry.customValues).map(([customId, createCustomValue]) => [
                customId,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.customValueFactory.build(createCustomValue, customDefsMap.get(customId)!),
            ]),
        );

        return customValuesMap;
    }

    private async getCustomDefs(customIds: CustomId[]): Promise<Map<CustomId, CustomDef>> {
        const customDefs = await this.customDefService.getByIds(customIds);
        const customDefsMap: Map<CustomId, CustomDef> = new Map(
            customDefs.map((customDef) => [customDef.id, customDef]),
        );

        const invalidCustomIds = customIds.filter((customId) => !customDefsMap.has(customId));
        if (invalidCustomIds.length) {
            throw this.buildInvalidCustomIdsError(invalidCustomIds);
        }

        return customDefsMap;
    }

    private buildInvalidCustomIdsError(invalidCustomIds: CustomId[]): Error {
        const invalidCustomIdsFormatted = invalidCustomIds
            .map((customId) => `[${customId}]`)
            .join(', ');

        return new Error(`${ERR_INVALID_CUSTOM_DEFS_FOR_ENTRY}: ${invalidCustomIdsFormatted}`);
    }
}
