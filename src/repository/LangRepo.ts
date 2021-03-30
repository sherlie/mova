import Knex from 'knex';
import { injectable, inject } from 'inversify';
import { Identifiers } from '@app/identifiers';
import { page, Page, PageScope } from './paging';
import { LangId } from '@model/Lang';

const TABLE = 'langs';

export interface LangRow {
    id: string;
    name: string;
    add_time: string;
}

export type InsertLangRow = Omit<LangRow, 'add_time'>;

export type LangScope = PageScope;

@injectable()
export class LangRepo {
    constructor(@inject(Identifiers.Database) private database: Knex) {}

    async getAll(scope: LangScope): Promise<Page<LangRow>> {
        const query = this.database<LangRow>(TABLE)
            .select('*')
            .orderBy('add_time');
        return await page(query, scope);
    }

    async getByIds(langIds: LangId[]): Promise<LangRow[]> {
        return await this.database<LangRow>(TABLE).whereIn('id', langIds);
    }

    async create(langRow: InsertLangRow): Promise<LangRow> {
        return await this.database(TABLE).insert<LangRow>(langRow);
    }
}
