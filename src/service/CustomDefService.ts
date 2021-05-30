import { inject, injectable } from 'inversify';
import { Identifiers } from '@app/identifiers';
import { CustomDef, CustomType, CustomId, OptionId, TableCellId } from '@model/CustomDef';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CustomDefRepo } from '@repository/CustomDefRepo';
import { CustomDefFactory } from './CustomDefFactory';
import { Page, PageScope } from '@repository/paging';
import { LangService } from './LangService';

export interface CustomDefScope extends PageScope {
    langId: LangId;
    partOfSpeech?: PartOfSpeech;
}

export interface CustomDefByPosScope {
    langId: LangId;
    partOfSpeech: PartOfSpeech;
}

export interface CreateCustomDef {
    name: string;
    type: CustomType;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    options?: string[];
    table?: string[];
}

export interface UpdateCustomDef {
    id: CustomId;
    name?: string;
    options?: Record<OptionId, string>;
    table?: Record<TableCellId, string>;
}

export interface CustomDefService {
    getAll(scope: CustomDefScope): Promise<Page<CustomDef>>;
    getByPartOfSpeech(scope: CustomDefByPosScope): Promise<CustomDef[]>;
    getByIds(customIds: CustomId[]): Promise<Map<CustomId, CustomDef>>;
    create(createCustomDef: CreateCustomDef): Promise<CustomDef>;
    update(updateCustomDef: UpdateCustomDef): Promise<CustomDef>;
    delete(customId: CustomId): Promise<CustomDef>;
}

const ERR_CUSTOM_DEF_NOT_FOUND = 'Custom definition not found';

@injectable()
export class CustomDefServiceImpl implements CustomDefService {
    constructor(
        @inject(Identifiers.CustomDefRepo) private customDefRepo: CustomDefRepo,
        @inject(Identifiers.CustomDefFactory) private customDefFactory: CustomDefFactory,
        @inject(Identifiers.LangService) private langService: LangService,
    ) {}

    async getAll(scope: CustomDefScope): Promise<Page<CustomDef>> {
        return await this.customDefRepo.getAll(scope);
    }

    async getByPartOfSpeech(scope: CustomDefByPosScope): Promise<CustomDef[]> {
        return await this.customDefRepo.getByPartOfSpeech(scope);
    }

    async getByIds(customIds: CustomId[]): Promise<Map<CustomId, CustomDef>> {
        const customDefs = await this.customDefRepo.getByIds(customIds);
        const customDefsMap: Map<CustomId, CustomDef> = new Map(
            customDefs.map((customDef) => [customDef.id, customDef]),
        );

        const invalidCustomIds = customIds.filter((customId) => !customDefsMap.has(customId));
        if (invalidCustomIds.length) {
            throw this.buildInvalidCustomIdsError(invalidCustomIds);
        }

        return customDefsMap;
    }

    async create(createCustomDef: CreateCustomDef): Promise<CustomDef> {
        await this.langService.getById(createCustomDef.langId);

        const customDef = this.customDefFactory.build(createCustomDef);
        await this.customDefRepo.create(customDef);
        return customDef;
    }

    async update(updateCustomDef: UpdateCustomDef): Promise<CustomDef> {
        const customDef = await this.customDefRepo.getById(updateCustomDef.id);
        if (!customDef) {
            throw this.buildInvalidCustomIdsError([updateCustomDef.id]);
        }

        const updatedCustomDef = this.customDefFactory.buildUpdated(customDef, updateCustomDef);
        await this.customDefRepo.update(updatedCustomDef);

        return updatedCustomDef;
    }

    async delete(customId: CustomId): Promise<CustomDef> {
        const customDef = await this.customDefRepo.getById(customId);
        if (!customDef) {
            throw this.buildInvalidCustomIdsError([customId]);
        }

        await this.customDefRepo.delete(customId);
        //TODO add event bus, delete all entry values
        return customDef;
    }

    private buildInvalidCustomIdsError(invalidCustomIds: CustomId[]): Error {
        const invalidCustomIdsFormatted = invalidCustomIds
            .map((customId) => `[${customId}]`)
            .join(', ');

        return new Error(`${ERR_CUSTOM_DEF_NOT_FOUND}: ${invalidCustomIdsFormatted}`);
    }
}
