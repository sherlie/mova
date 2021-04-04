import { Flavor } from '@util/flavor';
import { LangId } from './Lang';
import { PartOfSpeech } from './Entry';

export type CustomId = Flavor<string, 'Custom'>;

export enum CustomType {
    Text = 'text',
    SingleOption = 'single',
    MultiOption = 'multi',
    Table = 'table',
}

export interface BaseCustomDef {
    id: CustomId;
    name: string;
    type: CustomType;
    langId: LangId;
    partOfSpeech: PartOfSpeech;
}

export type OptionId = Flavor<string, 'Option'>;

export interface TextCustomDef extends BaseCustomDef {
    type: CustomType.Text;
}

export interface BaseOptionCustomDef extends BaseCustomDef {
    options: Map<OptionId, string>;
}
export interface SingleOptionCustomDef extends BaseOptionCustomDef {
    type: CustomType.SingleOption;
}

export interface MultiOptionCustomDef extends BaseOptionCustomDef {
    type: CustomType.MultiOption;
}

export type OptionCustomDef = SingleOptionCustomDef | MultiOptionCustomDef;

export type TableCellId = Flavor<string, 'TableCell'>;

export interface TableCell {
    index: number;
    name: string;
}
export interface TableCustomDef extends BaseCustomDef {
    type: CustomType.Table;
    table: Map<TableCellId, TableCell>;
}

export type CustomDef =
    | TextCustomDef
    | SingleOptionCustomDef
    | MultiOptionCustomDef
    | TableCustomDef;

export function isTextCustomDef(customDef: CustomDef): customDef is TextCustomDef {
    return customDef.type === CustomType.Text;
}

export function isSingleOptionCustomDef(customDef: CustomDef): customDef is SingleOptionCustomDef {
    return customDef.type === CustomType.SingleOption;
}

export function isMultiOptionCustomDef(customDef: CustomDef): customDef is MultiOptionCustomDef {
    return customDef.type === CustomType.MultiOption;
}

export function isTableCustomDef(customDef: CustomDef): customDef is TableCustomDef {
    return customDef.type === CustomType.Table;
}
