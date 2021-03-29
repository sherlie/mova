import {
    CustomDefinition,
    CustomDefinitionType,
    CustomId,
} from '@model/CustomDefinition';
import { PartOfSpeech } from '@model/Entry';
import { LangId } from '@model/Lang';
import { CustomDefinitionRow, CustomRepo } from '@repository/CustomRepo';
import * as enums from '@util/enums';

export interface CustomDefinitionScope {
    langId: LangId;
    pos?: PartOfSpeech;
}

export interface CustomService {
    getAll(scope: CustomDefinitionScope): Promise<CustomDefinition[]>;

    getOne(customId: CustomId): Promise<CustomDefinition>;
}

export class CustomServiceImpl implements CustomService {
    constructor(private customRepo: CustomRepo) {}

    async getAll(scope: CustomDefinitionScope): Promise<CustomDefinition[]> {
        const customDefinitionRows = await this.customRepo.getAll(scope);
        return customDefinitionRows.map(
            this.mapCustomDefinitionRowToCustomDefinition,
        );
    }

    async getOne(customId: CustomId): Promise<CustomDefinition> {
        throw new Error('Method not implemented.');
    }

    private mapCustomDefinitionRowToCustomDefinition(
        customDefinitionRow: CustomDefinitionRow,
    ) {
        const { id, lang_id, pos, name, type } = customDefinitionRow;
        const customDefinition: CustomDefinition = {
            id,
            langId: lang_id,
            pos: enums.cast(PartOfSpeech, pos),
            name,
            type: enums.cast(CustomDefinitionType, type),
        };

        const props = JSON.parse(customDefinitionRow.props);

        switch (customDefinition.type) {
            case CustomDefinitionType.Option:
                customDefinition;
                break;
            case CustomDefinitionType.Table:
                break;
        }

        return customDefinition;
    }
}
