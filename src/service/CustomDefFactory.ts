import { v4 as uuidv4 } from 'uuid';
import {
    BaseCustomDef,
    CustomDef,
    CustomType,
    MultiOptionCustomDef,
    OptionId,
    SingleOptionCustomDef,
    TableCell,
    TableCellId,
    TableCustomDef,
    TextCustomDef,
} from '@model/CustomDef';
import { CreateCustomDef } from './CustomDefService';
import { injectable } from 'inversify';

export interface CustomDefFactory {
    build(createCustomDef: CreateCustomDef): CustomDef;
}

const ERR_OPTION_TYPE_NO_OPTIONS = `Custom definition for types '${CustomType.SingleOption}' or '${CustomType.MultiOption}' must contain options`;
const ERR_TABLE_TYPE_NO_TABLE_CELLS = `Custom definition for type '${CustomType.Table}' must contain table cell names`;

@injectable()
export class CustomDefFactoryImpl implements CustomDefFactory {
    build(createCustomDef: CreateCustomDef): CustomDef {
        switch (createCustomDef.type) {
            case CustomType.Text:
                return this.buildText(createCustomDef);
            case CustomType.SingleOption:
            case CustomType.MultiOption:
                return this.buildOption(createCustomDef, createCustomDef.type);
            case CustomType.Table:
                return this.buildTable(createCustomDef);
        }
    }

    private buildBase(createCustomDef: CreateCustomDef): BaseCustomDef {
        const { name, type, langId, partOfSpeech } = createCustomDef;
        return {
            id: uuidv4(),
            name,
            type,
            langId,
            partOfSpeech,
        };
    }

    private buildText(createCustomDef: CreateCustomDef): TextCustomDef {
        return {
            ...this.buildBase(createCustomDef),
            type: CustomType.Text,
        };
    }

    private buildOption(
        createCustomDef: CreateCustomDef,
        type: CustomType.SingleOption | CustomType.MultiOption,
    ): SingleOptionCustomDef | MultiOptionCustomDef {
        const { options } = createCustomDef;
        if (!options || !options.length) {
            throw new Error(ERR_OPTION_TYPE_NO_OPTIONS);
        }

        return {
            ...this.buildBase(createCustomDef),
            type,
            options: new Map<OptionId, string>(options.map((option) => [uuidv4(), option])),
        };
    }

    private buildTable(createCustomDef: CreateCustomDef): TableCustomDef {
        const { table } = createCustomDef;
        if (!table || !table.length) {
            throw new Error(ERR_TABLE_TYPE_NO_TABLE_CELLS);
        }

        return {
            ...this.buildBase(createCustomDef),
            type: CustomType.Table,
            table: new Map<TableCellId, TableCell>(
                table.map((name, i) => [uuidv4(), { index: i, name }]),
            ),
        };
    }
}
