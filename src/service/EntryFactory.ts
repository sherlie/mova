import { CustomDef, CustomId } from '@model/CustomDef';
import { CustomValue } from '@model/CustomValue';
import { Entry } from '@model/Entry';
import { Maybe } from '@util/types';
import { CreateEntry, SaveCustomValue, UpdateEntry } from './EntryService';
import { LangService } from './LangService';
import { Identifiers } from '@app/identifiers';
import { inject, injectable } from 'inversify';
import { CustomDefService } from './CustomDefService';
import { v4 as uuidv4 } from 'uuid';
import { CustomValueFactory } from './CustomValueFactory';

export interface EntryFactory {
    build(createEntry: CreateEntry): Promise<Entry>;
    buildUpdated(entry: Entry, updateEntry: UpdateEntry): Promise<Entry>;
}

const ERR_INVALID_CUSTOM_DEFS_FOR_ENTRY =
    'Entry custom value definitions are not valid for the entry';

@injectable()
export class EntryFactorImpl implements EntryFactory {
    constructor(
        @inject(Identifiers.LangService) private langService: LangService,
        @inject(Identifiers.CustomDefService) private customDefService: CustomDefService,
        @inject(Identifiers.CustomValueFactory) private customValueFactory: CustomValueFactory,
    ) {}

    async build(createEntry: CreateEntry): Promise<Entry> {
        await this.langService.getById(createEntry.langId);

        const entry: Entry = {
            id: uuidv4(),
            original: createEntry.original,
            translation: createEntry.translation,
            langId: createEntry.langId,
            partOfSpeech: createEntry.partOfSpeech,
        };

        entry.customValues = await this.buildCustomValues(entry, createEntry.customValues);

        return entry;
    }

    async buildUpdated(entry: Entry, updateEntry: UpdateEntry): Promise<Entry> {
        if (updateEntry.original) {
            entry.original = updateEntry.original;
        }
        if (updateEntry.translation) {
            entry.translation = updateEntry.translation;
        }
        if (updateEntry.customValues) {
            const newCustomValues = await this.buildCustomValues(entry, updateEntry.customValues);
            const combinedCustomValues = new Map([
                ...(entry.customValues ?? new Map()),
                ...(newCustomValues ?? new Map()),
            ]);
            entry.customValues = combinedCustomValues.size ? combinedCustomValues : undefined;
        }

        return entry;
    }

    private async buildCustomValues(
        entry: Entry,
        customValues: Maybe<Record<CustomId, SaveCustomValue>>,
    ): Promise<Maybe<Map<CustomId, CustomValue>>> {
        if (!customValues || !Object.keys(customValues).length) {
            return;
        }

        const customDefsMap = await this.getCustomDefsForEntry(entry, Object.keys(customValues));

        const customValuesMap = new Map<CustomId, CustomValue>(
            Object.entries<CustomValue>(customValues).map(([customId, createCustomValue]) => [
                customId,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.customValueFactory.build(createCustomValue, customDefsMap.get(customId)!),
            ]),
        );

        return customValuesMap;
    }

    private async getCustomDefsForEntry(
        entry: Entry,
        customIds: CustomId[],
    ): Promise<Map<CustomId, CustomDef>> {
        const customDefsMap = await this.customDefService.getByIds(customIds);

        const invalidCustomIdsForEntry = Array.from(customDefsMap.values())
            .filter(
                (customDef) =>
                    customDef.langId !== entry.langId ||
                    customDef.partOfSpeech !== entry.partOfSpeech,
            )
            .map((customDef) => customDef.id);
        if (invalidCustomIdsForEntry.length) {
            throw this.buildInvalidCustomIdsError(invalidCustomIdsForEntry);
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
