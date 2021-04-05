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
import { CreateCustomValue } from './EntryService';

export interface CustomValueFactory {
    build(createCustomValue: CreateCustomValue, customDef: CustomDef): CustomValue;
}

const ERR_TEXT_TYPE_NO_TEXT = `Custom value for type '${CustomType.Text}' must contain text`;
const ERR_OPTION_TYPE_NO_OPTION = `Custom value for types '${CustomType.SingleOption}' or '${CustomType.MultiOption}' must contain selected option(s)`;
const ERR_OPTION_TYPE_INVALID_OPTION = `Custom value for types '${CustomType.SingleOption}' or '${CustomType.MultiOption}' must contain valid options only`;
const ERR_TABLE_TYPE_NO_CELLS = `Custom value for type '${CustomType.Table}' must contain table cell values`;
const ERR_TABLE_TYPE_INVALID_CELL = `Custom value for type '${CustomType.Table}' must contain table cell values for valid cells only`;

@injectable()
export class CustomValueFactoryImpl implements CustomValueFactory {
    build(createCustomValue: CreateCustomValue, customDef: CustomDef): CustomValue {
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
        createCustomValue: CreateCustomValue,
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
        createCustomValue: CreateCustomValue,
        customDef: SingleOptionCustomDef,
    ): SingleOptionCustomValue {
        if (!createCustomValue.singleOption) {
            throw new Error(ERR_OPTION_TYPE_NO_OPTION);
        }

        if (!customDef.options.has(createCustomValue.singleOption)) {
            throw new Error(
                `${ERR_OPTION_TYPE_INVALID_OPTION}: [${createCustomValue.singleOption}]`,
            );
        }

        return {
            definition: customDef,
            option: createCustomValue.singleOption,
        };
    }

    private buildMultiOption(
        createCustomValue: CreateCustomValue,
        customDef: MultiOptionCustomDef,
    ): MultiOptionCustomValue {
        if (!createCustomValue.multiOption || !createCustomValue.multiOption.length) {
            throw new Error(ERR_OPTION_TYPE_NO_OPTION);
        }

        const invalidOptions = createCustomValue.multiOption.filter(
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
            options: createCustomValue.multiOption,
        };
    }

    private buildTable(
        createCustomValue: CreateCustomValue,
        customDef: TableCustomDef,
    ): TableCustomValue {
        if (!createCustomValue.table || !createCustomValue.table.length) {
            throw new Error(ERR_TABLE_TYPE_NO_CELLS);
        }

        const invalidCells = createCustomValue.table.filter(
            (cell) => !customDef.table.has(cell.id),
        );
        if (invalidCells.length) {
            const invalidCellsFormatted = invalidCells.map((cell) => `[${cell.id}]`).join(', ');

            throw new Error(`${ERR_TABLE_TYPE_INVALID_CELL}: ${invalidCellsFormatted}`);
        }

        return {
            definition: customDef,
            cells: Object.fromEntries(createCustomValue.table.map((cell) => [cell.id, cell.value])),
        };
    }
}
