import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { Identifiers } from '@app/identifiers';
import { mapPage, page, Page, PageScope } from './paging';
import { Lang, LangId } from '@model/Lang';
import { Maybe } from '@util/types';

const TABLE = 'langs';

interface LangRecord {
    id: string;
    name: string;
    add_time: string;
}

export type LangScope = PageScope;

@injectable()
export class LangRepo {
    constructor(@inject(Identifiers.Database) private database: Knex<LangRecord>) {}

    async getAll(scope: LangScope): Promise<Page<Lang>> {
        const query = this.database(TABLE).select('*').orderBy('add_time');
        const langRecordPage = await page(query, scope);
        return mapPage(langRecordPage, (langRecord) => this.mapLangRecordToLang(langRecord));
    }

    async getById(langId: LangId): Promise<Maybe<Lang>> {
        const langRecord = await this.database(TABLE).where('id', langId).first();
        return langRecord && this.mapLangRecordToLang(langRecord);
    }

    async getByIds(langIds: LangId[]): Promise<Lang[]> {
        const langRecords = await this.database(TABLE).whereIn('id', langIds);
        return langRecords.map((langRecord) => this.mapLangRecordToLang(langRecord));
    }

    async create(lang: Lang): Promise<void> {
        await this.database(TABLE).insert(lang);
    }

    async update(lang: Lang): Promise<void> {
        await this.database(TABLE)
            .update({
                name: lang.name,
            })
            .where({ id: lang.id });
    }

    async delete(langId: LangId): Promise<void> {
        return await this.database(TABLE).where({ id: langId }).delete();
    }

    async deleteAll(): Promise<void> {
        await this.database(TABLE).delete();
    }

    private mapLangRecordToLang(langRecord: LangRecord): Lang {
        return {
            id: langRecord.id,
            name: langRecord.name,
        };
    }
}
