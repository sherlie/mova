import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { LangId } from '@model/Lang';
import { PartOfSpeech } from '@model/Entry';
import {
    CustomDef,
    CustomId,
    CustomType,
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    isTableCustomDef,
} from '@model/CustomDef';
import { Identifiers } from '@app/identifiers';
import { mapPage, page, Page, PageScope } from './paging';

const TABLE = 'custom_defs';

interface CustomDefRecord {
    id: string;
    name: string;
    type: string;
    lang_id: string;
    pos: string;
    props?: string;
}

export interface CustomDefScope extends PageScope {
    langId: LangId;
    partOfSpeech?: PartOfSpeech;
}

export interface CustomDefByPosScope {
    langId: LangId;
    partOfSpeech: PartOfSpeech;
}

@injectable()
export class CustomDefRepo {
    constructor(@inject(Identifiers.Database) private database: Knex<CustomDefRecord>) {}

    async getAll(scope: CustomDefScope): Promise<Page<CustomDef>> {
        let query = this.database(TABLE)
            .select('*')
            .where('lang_id', scope.langId)
            .orderBy('add_time');

        if (scope.partOfSpeech) {
            query = query.where('pos', scope.partOfSpeech);
        }

        const customDefRecords = await page(query, scope);
        return mapPage(customDefRecords, (customDefRecord) =>
            this.mapCustomDefRecordToCustomDef(customDefRecord),
        );
    }

    async getByPartOfSpeech(scope: CustomDefByPosScope): Promise<CustomDef[]> {
        const customDefRecords = await this.database(TABLE)
            .select('*')
            .where('lang_id', scope.langId)
            .where('pos', scope.partOfSpeech);

        return customDefRecords.map((customDefRecord) =>
            this.mapCustomDefRecordToCustomDef(customDefRecord),
        );
    }

    async getByIds(customIds: CustomId[]): Promise<CustomDef[]> {
        const customDefRecords = await this.database(TABLE).whereIn('id', customIds);

        return customDefRecords.map((customDefRecord) =>
            this.mapCustomDefRecordToCustomDef(customDefRecord),
        );
    }

    async create(customDef: CustomDef): Promise<CustomDefRecord> {
        return await this.database(TABLE).insert({
            id: customDef.id,
            name: customDef.name,
            type: customDef.type,
            lang_id: customDef.langId,
            pos: customDef.partOfSpeech,
            props: this.serializeProps(customDef),
        });
    }

    private mapCustomDefRecordToCustomDef(customDefRecord: CustomDefRecord): CustomDef {
        return {
            id: customDefRecord.id,
            langId: customDefRecord.lang_id,
            partOfSpeech: customDefRecord.pos as PartOfSpeech,
            name: customDefRecord.name,
            type: customDefRecord.type as CustomType,
            ...this.deserializeProps(customDefRecord),
        } as CustomDef;
    }

    private serializeProps(customDef: CustomDef): string | undefined {
        if (isSingleOptionCustomDef(customDef) || isMultiOptionCustomDef(customDef)) {
            return JSON.stringify(Object.fromEntries(Array.from(customDef.options)));
        } else if (isTableCustomDef(customDef)) {
            return JSON.stringify(Object.fromEntries(Array.from(customDef.table)));
        }
    }

    private deserializeProps(
        customDefRecord: CustomDefRecord,
    ): Record<string, unknown> | undefined {
        const { type, props } = customDefRecord;
        const deserializedProps = props && JSON.parse(props);
        if (type === CustomType.SingleOption || type === CustomType.MultiOption) {
            return { options: new Map(Object.entries(deserializedProps)) };
        } else if (type === CustomType.Table) {
            return { table: new Map(Object.entries(deserializedProps)) };
        }
    }
}
