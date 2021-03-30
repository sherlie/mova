import { Flavor } from '@util/flavor';
import { LangId } from './Lang';
import { PartOfSpeech } from './Entry';

export type CustomId = Flavor<string, 'Custom'>;

export enum CustomDefinitionType {
    Text = 'text',
    Option = 'option',
    Table = 'table',
}

export interface CustomDefinition {
    id: CustomId;
    name: string;
    type: CustomDefinitionType;
    langId: LangId;
    pos: PartOfSpeech;
}

export interface OptionCustomDefinition extends CustomDefinition {
    options: Option[];
}

export type OptionId = Flavor<string, 'Option'>;

export interface Option {
    id: OptionId;
    value: string;
}

export interface TableCustomDefinition extends CustomDefinition {
    rows: TableRow[];
}

export type TableRowId = Flavor<string, 'TableGroup'>;

export interface TableRow {
    id: TableRowId;
    name: string;
    row: number;
    col: number;
}
