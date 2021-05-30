import { Identifiers } from '@app/identifiers';
import { Lang, LangId } from '@model/Lang';
import { LangRepo } from '@repository/LangRepo';
import { Page, PageScope } from '@repository/paging';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

export type LangScope = PageScope;

export interface CreateLang {
    name: string;
}

export interface UpdateLang {
    id: LangId;
    name: string;
}

export interface LangService {
    getAll(scope: LangScope): Promise<Page<Lang>>;
    getById(langId: LangId): Promise<Lang>;
    getByIds(langIds: LangId[]): Promise<Map<LangId, Lang>>;
    create(createLang: CreateLang): Promise<Lang>;
    update(updateLang: UpdateLang): Promise<Lang>;
    delete(langId: LangId): Promise<Lang>;
    deleteAll(): Promise<void>;
}

const ERR_LANG_NOT_FOUND = 'Language not found';

@injectable()
export class LangServiceImpl implements LangService {
    constructor(@inject(Identifiers.LangRepo) private langRepo: LangRepo) {}

    async getAll(scope: LangScope): Promise<Page<Lang>> {
        return await this.langRepo.getAll(scope);
    }

    async getById(langId: LangId): Promise<Lang> {
        const lang = await this.langRepo.getById(langId);
        if (!lang) {
            throw this.buildInvalidLangIdsError([langId]);
        }

        return lang;
    }

    async getByIds(langIds: LangId[]): Promise<Map<LangId, Lang>> {
        const langs = await this.langRepo.getByIds(langIds);

        const langsMap = new Map<LangId, Lang>(langs.map((lang) => [lang.id, lang]));

        const invalidLangIds = langIds.filter((langId) => !langsMap.has(langId));
        if (invalidLangIds.length) {
            throw this.buildInvalidLangIdsError(invalidLangIds);
        }

        return langsMap;
    }

    async create(createLang: CreateLang): Promise<Lang> {
        const lang: Lang = {
            id: uuidv4(),
            name: createLang.name,
        };
        await this.langRepo.create(lang);
        return lang;
    }

    async update(updateLang: UpdateLang): Promise<Lang> {
        const lang = await this.getById(updateLang.id);
        lang.name = updateLang.name;
        await this.langRepo.update(lang);
        return lang;
    }

    async delete(langId: LangId): Promise<Lang> {
        const lang = await this.getById(langId);
        await this.langRepo.delete(langId);
        return lang;
    }

    async deleteAll(): Promise<void> {
        await this.langRepo.deleteAll();
    }

    private buildInvalidLangIdsError(invalidLangIds: LangId[]): Error {
        const invalidCustomIdsFormatted = invalidLangIds.map((langId) => `[${langId}]`).join(', ');

        return new Error(`${ERR_LANG_NOT_FOUND}: ${invalidCustomIdsFormatted}`);
    }
}
