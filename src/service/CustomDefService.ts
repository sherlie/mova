import { inject, injectable } from 'inversify';
import { Identifiers } from '@app/identifiers';
import { CustomDef, CustomType, CustomId } from '@model/CustomDef';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CustomDefRepo } from '@repository/CustomDefRepo';
import { CustomDefFactory } from './CustomDefFactory';

export interface CustomDefScope {
    langId: LangId;
    partOfSpeech: PartOfSpeech;
}

export type CreateCustomDef = {
    name: string;
    type: CustomType;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
    options?: string[];
    table?: string[];
};

export interface CustomDefService {
    getAll(scope: CustomDefScope): Promise<CustomDef[]>;
    getByIds(customIds: CustomId[]): Promise<CustomDef[]>;
    getByIds(customIds: CustomId[]): Promise<CustomDef[]>;
    create(createCustomDef: CreateCustomDef): Promise<CustomDef>;
}

@injectable()
export class CustomDefServiceImpl implements CustomDefService {
    constructor(
        @inject(Identifiers.CustomDefRepo) private customDefRepo: CustomDefRepo,
        @inject(Identifiers.CustomDefFactory) private customDefFactory: CustomDefFactory,
    ) {}

    async getAll(scope: CustomDefScope): Promise<CustomDef[]> {
        return await this.customDefRepo.getAll(scope);
    }

    async getByIds(customIds: CustomId[]): Promise<CustomDef[]> {
        return await this.customDefRepo.getByIds(customIds);
    }

    async create(createCustomDef: CreateCustomDef): Promise<CustomDef> {
        const customDef = this.customDefFactory.build(createCustomDef);
        await this.customDefRepo.create(customDef);
        return customDef;
    }
}
