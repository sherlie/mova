import {
    CustomId,
    CustomDefinition,
    OptionId,
    TableRowId,
} from './CustomDefinition';

export interface CustomValue {
    id: CustomId;
    definition: CustomDefinition;
}

export interface TextCustomValue extends CustomValue {
    text: string;
}

export interface SingleOptionCustomValue extends CustomValue {
    option: OptionId;
}

export interface MultiOptionCustomValue extends CustomValue {
    options: OptionId[];
}

export interface TableCustomValue extends CustomValue {
    rowValues: Record<TableRowId, string>;
}
