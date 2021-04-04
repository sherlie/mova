import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { LangId } from '@model/Lang';
import { PartOfSpeech } from '@model/Entry';
import { CustomDefScope } from '@service/CustomDefService';
import {
    CustomDef,
    CustomId,
    CustomType,
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    isTableCustomDef,
    OptionId,
    TableCell,
    TableCellId,
} from '@model/CustomDef';
import { Identifiers } from '@app/identifiers';

const TABLE = 'custom_defs';

interface CustomDefRecord {
    id: string;
    name: string;
    type: string;
    lang_id: string;
    pos: string;
    props?: string;
}

export interface GetAllScope {
    langId: LangId;
    partOfSpeech: PartOfSpeech;
}

@injectable()
export class CustomDefRepo {
    constructor(@inject(Identifiers.Database) private database: Knex<CustomDefRecord>) {}

    async getAll({ langId, partOfSpeech }: CustomDefScope): Promise<CustomDef[]> {
        const customDefRecords = await this.database(TABLE)
            .select('*')
            .where('lang_id', langId)
            .where('pos', partOfSpeech);

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
            partOfSpeech: customDefRecord.pos,
            name: customDefRecord.name,
            type: customDefRecord.type,
            ...this.deserializeProps(customDefRecord),
        };
    }

    private serializeProps(customDef: CustomDef): string | undefined {
        if (isSingleOptionCustomDef(customDef) || isMultiOptionCustomDef(customDef)) {
            return JSON.stringify({ options: Array.from(customDef.options.entries()) });
        } else if (isTableCustomDef(customDef)) {
            return JSON.stringify({ table: Array.from(customDef.table.entries()) });
        }
    }

    private deserializeProps(customDefRecord: CustomDefRecord): any {
        const { type, props } = customDefRecord;
        const deserializedProps = props && JSON.parse(props);
        if (type === CustomType.SingleOption || type === CustomType.MultiOption) {
            return {
                options: new Map<OptionId, string>(deserializedProps.options),
            };
        } else if (type === CustomType.Table) {
            return { table: new Map<TableCellId, TableCell>(deserializedProps.table) };
        }
    }
}
