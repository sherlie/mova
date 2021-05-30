import {
    CustomDef,
    CustomType,
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    isTextCustomDef,
    MultiOptionCustomDef,
    SingleOptionCustomDef,
    TableCustomDef,
    TextCustomDef,
} from '@model/CustomDef';
import {
    CustomValue,
    MultiOptionCustomValue,
    SingleOptionCustomValue,
    TableCustomValue,
    TextCustomValue,
} from '@model/CustomValue';
import { injectable } from 'inversify';
import { SaveCustomValue } from './EntryService';

export interface CustomValueFactory {
    build(createCustomValue: CustomValue, customDef: CustomDef): CustomValue;
}

const ERR_TEXT_TYPE_NO_TEXT = `Custom value for type '${CustomType.Text}' must contain text`;
const ERR_OPTION_TYPE_NO_OPTION = `Custom value for types '${CustomType.SingleOption}' or '${CustomType.MultiOption}' must contain selected option(s)`;
const ERR_OPTION_TYPE_INVALID_OPTION = `Custom value for types '${CustomType.SingleOption}' or '${CustomType.MultiOption}' must contain valid options only`;
const ERR_TABLE_TYPE_NO_CELLS = `Custom value for type '${CustomType.Table}' must contain table cell values`;
const ERR_TABLE_TYPE_INVALID_CELL = `Custom value for type '${CustomType.Table}' must contain table cell values for valid cells only`;

@injectable()
export class CustomValueFactoryImpl implements CustomValueFactory {
    build(createCustomValue: CustomValue, customDef: CustomDef): CustomValue {
        if (isTextCustomDef(customDef)) {
            return this.buildText(createCustomValue, customDef);
        } else if (isSingleOptionCustomDef(customDef)) {
            return this.buildSingleOption(createCustomValue, customDef);
        } else if (isMultiOptionCustomDef(customDef)) {
            return this.buildMultiOption(createCustomValue, customDef);
        } else {
            return this.buildTable(createCustomValue, customDef);
        }
    }

    private buildText(
        createCustomValue: SaveCustomValue,
        customDef: TextCustomDef,
    ): TextCustomValue {
        if (!createCustomValue.text) {
            throw new Error(ERR_TEXT_TYPE_NO_TEXT);
        }

        return {
            definition: customDef,
            text: createCustomValue.text,
        };
    }

    private buildSingleOption(
        createCustomValue: SaveCustomValue,
        customDef: SingleOptionCustomDef,
    ): SingleOptionCustomValue {
        if (!createCustomValue.option) {
            throw new Error(ERR_OPTION_TYPE_NO_OPTION);
        }

        if (!customDef.options.has(createCustomValue.option)) {
            throw new Error(`${ERR_OPTION_TYPE_INVALID_OPTION}: [${createCustomValue.option}]`);
        }

        return {
            definition: customDef,
            option: createCustomValue.option,
        };
    }

    private buildMultiOption(
        createCustomValue: SaveCustomValue,
        customDef: MultiOptionCustomDef,
    ): MultiOptionCustomValue {
        if (!createCustomValue.options || !createCustomValue.options.length) {
            throw new Error(ERR_OPTION_TYPE_NO_OPTION);
        }

        createCustomValue.options = Array.from(new Set(createCustomValue.options));

        const invalidOptions = createCustomValue.options.filter(
            (option) => !customDef.options.has(option),
        );
        if (invalidOptions.length) {
            const invalidOptionsFormatted = invalidOptions
                .map((option) => `[${option}]`)
                .join(', ');

            throw new Error(`${ERR_OPTION_TYPE_INVALID_OPTION}: ${invalidOptionsFormatted}`);
        }

        return {
            definition: customDef,
            options: createCustomValue.options,
        };
    }

    private buildTable(
        createCustomValue: SaveCustomValue,
        customDef: TableCustomDef,
    ): TableCustomValue {
        if (!createCustomValue.table || !Object.keys(createCustomValue.table).length) {
            throw new Error(ERR_TABLE_TYPE_NO_CELLS);
        }

        const invalidCellIds = Object.keys(createCustomValue.table).filter(
            (cellId) => !customDef.table.has(cellId),
        );
        if (invalidCellIds.length) {
            const invalidCellsFormatted = invalidCellIds.map((cellId) => `[${cellId}]`).join(', ');

            throw new Error(`${ERR_TABLE_TYPE_INVALID_CELL}: ${invalidCellsFormatted}`);
        }

        return {
            definition: customDef,
            table: new Map(Object.entries(createCustomValue.table)),
        };
    }
}
