import { Identifiers } from '@app/identifiers';
import { Lang, LangId } from '@model/Lang';
import { LangRepo, LangRow } from '@repository/LangRepo';
import { mapPage, Page, PageScope } from '@repository/paging';
import { inject, injectable } from 'inversify';

export type LangScope = PageScope;

export interface CreateLang {
    name: string;
}

export interface LangService {
    getAll(scope: LangScope): Promise<Page<Lang>>;
    getByIds(langIds: LangId[]): Promise<Lang[]>;
    //create(createLang: CreateLang): Promise<Lang>;
}

@injectable()
export class LangServiceImpl implements LangService {
    constructor(@inject(Identifiers.LangRepo) private langRepo: LangRepo) {}

    async getAll(scope: LangScope): Promise<Page<Lang>> {
        const langRows = await this.langRepo.getAll(scope);
        return mapPage(langRows, this.mapLangRowToLang);
    }

    async getByIds(langIds: LangId[]): Promise<Lang[]> {
        const langRows = await this.langRepo.getByIds(langIds);
        return langRows.map(this.mapLangRowToLang);
    }

    /*async createLang(langRow: InsertLangRow): Promise<Lang> {

    }*/

    private mapLangRowToLang(langRow: LangRow): Lang {
        return {
            id: langRow.id,
            name: langRow.name,
        };
    }
}
