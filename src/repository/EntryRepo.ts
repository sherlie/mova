import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { Identifiers } from '@app/identifiers';
import { mapPage, page, Page, PageScope } from './paging';
import { LangId } from '@model/Lang';
import { Entry, EntryId, PartOfSpeech } from '@model/Entry';
import { Maybe, Replace } from '@util/types';
import { CustomId } from '@model/CustomDef';
import { CustomValue } from '@model/CustomValue';

const TABLE = 'entries';

interface EntryRecord {
    id: string;
    original: string;
    translation: string;
    lang_id: string;
    pos: string;
    custom: string;
    add_time: string;
}

export type EntryWithoutCustomDefs = Replace<
    Entry,
    {
        customValues?: Map<CustomId, CustomValueWithoutDef>;
    }
>;

export type CustomValueWithoutDef = Omit<CustomValue, 'definition'>;

export interface EntryScope extends PageScope {
    langId: LangId;
}

@injectable()
export class EntryRepo {
    constructor(@inject(Identifiers.Database) private database: Knex<EntryRecord>) {}

    async getAll(scope: EntryScope): Promise<Page<EntryWithoutCustomDefs>> {
        const query = this.database(TABLE)
            .select('*')
            .where('lang_id', scope.langId)
            .orderBy('add_time');
        const entryRecordPage = await page(query, scope);

        return mapPage(entryRecordPage, (entryRecord) => this.mapEntryRecordToEntry(entryRecord));
    }

    async getById(entryId: EntryId): Promise<Maybe<EntryWithoutCustomDefs>> {
        const entryRecord = await this.database(TABLE).select('*').where('id', entryId).first();
        return entryRecord && this.mapEntryRecordToEntry(entryRecord);
    }

    async getByIds(entryIds: EntryId[]): Promise<EntryWithoutCustomDefs[]> {
        const entryRecords = await this.database(TABLE).select('*').whereIn('id', entryIds);
        return entryRecords.map((entryRecord) => this.mapEntryRecordToEntry(entryRecord));
    }

    async create(entry: Entry): Promise<Entry> {
        return await this.database(TABLE).insert({
            id: entry.id,
            original: entry.original,
            translation: entry.translation,
            lang_id: entry.langId,
            pos: entry.partOfSpeech,
            custom: this.serializeCustom(entry.customValues),
        });
    }

    private mapEntryRecordToEntry(entryRecord: EntryRecord): EntryWithoutCustomDefs {
        return {
            id: entryRecord.id,
            original: entryRecord.original,
            translation: entryRecord.translation,
            langId: entryRecord.lang_id,
            partOfSpeech: entryRecord.pos as PartOfSpeech,
            customValues: this.deserializeCustom(entryRecord.custom),
        };
    }

    private serializeCustom(
        customValues: Map<CustomId, CustomValue> | undefined,
    ): string | undefined {
        if (!customValues) {
            return;
        }
        return JSON.stringify(
            Object.fromEntries(
                Array.from(customValues.entries()).map(([customId, customValue]) => {
                    const { definition, ...customValueProps } = customValue;

                    return [customId, customValueProps];
                }),
            ),
        );
    }

    private deserializeCustom(
        custom: string | undefined,
    ): Map<CustomId, CustomValueWithoutDef> | undefined {
        return custom ? new Map(Object.entries(JSON.parse(custom))) : undefined;
    }
}
