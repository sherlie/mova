import { Identifiers } from '@app/identifiers';
import { Lang, LangId } from '@model/Lang';
import { LangRepo } from '@repository/LangRepo';
import { Page, PageScope } from '@repository/paging';
import { Maybe } from '@util/types';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

export type LangScope = PageScope;

export interface CreateLang {
    name: string;
}

export interface LangService {
    getAll(scope: LangScope): Promise<Page<Lang>>;
    getById(langIds: LangId): Promise<Maybe<Lang>>;
    getByIds(langIds: LangId[]): Promise<Lang[]>;
    create(createLang: CreateLang): Promise<Lang>;
    deleteAll(): Promise<void>;
}

@injectable()
export class LangServiceImpl implements LangService {
    constructor(@inject(Identifiers.LangRepo) private langRepo: LangRepo) {}

    async getAll(scope: LangScope): Promise<Page<Lang>> {
        return await this.langRepo.getAll(scope);
    }

    async getById(langId: LangId): Promise<Maybe<Lang>> {
        return await this.langRepo.getById(langId);
    }

    async getByIds(langIds: LangId[]): Promise<Lang[]> {
        return await this.langRepo.getByIds(langIds);
    }

    async create(createLang: CreateLang): Promise<Lang> {
        const lang: Lang = {
            id: uuidv4(),
            name: createLang.name,
        };
        await this.langRepo.create(lang);
        return lang;
    }

    async deleteAll(): Promise<void> {
        await this.langRepo.deleteAll();
    }
}
