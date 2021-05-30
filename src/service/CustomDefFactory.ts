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
import { CreateCustomDef, UpdateCustomDef } from './CustomDefService';
import { injectable } from 'inversify';

export interface CustomDefFactory {
    build(createCustomDef: CreateCustomDef): CustomDef;
    buildUpdated(customDef: CustomDef, updateCustomDef: UpdateCustomDef): CustomDef;
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

    buildUpdated(customDef: CustomDef, updateCustomDef: UpdateCustomDef): CustomDef {
        if (updateCustomDef.name) {
            customDef.name = updateCustomDef.name;
        }

        switch (customDef.type) {
            case CustomType.SingleOption:
            case CustomType.MultiOption:
                this.buildUpdatedOption(customDef, updateCustomDef.options);
                break;
            case CustomType.Table:
                this.buildUpdatedTable(customDef, updateCustomDef.table);
                break;
        }

        return customDef;
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
        if (!options || options.length < 2) {
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
        if (!table || table.length < 2) {
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

    buildUpdatedOption(
        optionCustomDef: SingleOptionCustomDef | MultiOptionCustomDef,
        updateOptions?: Record<OptionId, string>,
    ): void {
        if (updateOptions && Object.keys(updateOptions).length) {
            for (const [optionId, optionName] of Object.entries<string>(updateOptions)) {
                if (!optionCustomDef.options.has(optionId)) {
                    continue;
                }
                optionCustomDef.options.set(optionId, optionName);
            }
        }
    }

    buildUpdatedTable(
        tableCustomDef: TableCustomDef,
        updateTable?: Record<TableCellId, string>,
    ): void {
        if (updateTable && Object.keys(updateTable).length) {
            for (const [cellId, cellName] of Object.entries<string>(updateTable)) {
                if (!tableCustomDef.table.has(cellId)) {
                    continue;
                }
                tableCustomDef.table.set(cellId, {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    ...tableCustomDef.table.get(cellId)!,
                    name: cellName,
                });
            }
        }
    }
}
