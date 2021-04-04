import {
    CustomDef,
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    isTableCustomDef,
    isTextCustomDef,
    MultiOptionCustomDef,
    OptionId,
    SingleOptionCustomDef,
    TableCellId,
    TableCustomDef,
    TextCustomDef,
} from './CustomDef';

export interface BaseCustomValue {
    definition: CustomDef;
}

export interface TextCustomValue extends BaseCustomValue {
    definition: TextCustomDef;
    text: string;
}

export interface SingleOptionCustomValue extends BaseCustomValue {
    definition: SingleOptionCustomDef;
    option: OptionId;
}

export interface MultiOptionCustomValue extends BaseCustomValue {
    definition: MultiOptionCustomDef;
    options: OptionId[];
}

export interface TableCustomValue extends BaseCustomValue {
    definition: TableCustomDef;
    cells: Record<TableCellId, string>;
}

export type CustomValue =
    | TextCustomValue
    | SingleOptionCustomValue
    | MultiOptionCustomValue
    | TableCustomValue;

export function isTextCustomValue(customValue: CustomValue): customValue is TextCustomValue {
    return isTextCustomDef(customValue.definition);
}

export function isSingleOptionCustomValue(
    customValue: CustomValue,
): customValue is SingleOptionCustomValue {
    return isSingleOptionCustomDef(customValue.definition);
}

export function isMultiOptionCustomValue(
    customValue: CustomValue,
): customValue is MultiOptionCustomValue {
    return isMultiOptionCustomDef(customValue.definition);
}

export function isTableCustomValue(customValue: CustomValue): customValue is TableCustomValue {
    return isTableCustomDef(customValue.definition);
}
