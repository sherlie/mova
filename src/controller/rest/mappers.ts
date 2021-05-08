import {
    CustomDef,
    CustomId,
    CustomType,
    isMultiOptionCustomDef,
    isSingleOptionCustomDef,
    isTableCustomDef,
    OptionId,
    TableCellId,
} from '@model/CustomDef';
import {
    CustomValue,
    isMultiOptionCustomValue,
    isSingleOptionCustomValue,
    isTableCustomValue,
    isTextCustomValue,
} from '@model/CustomValue';
import { Entry, PartOfSpeech } from '@model/Entry';
import { Lang } from '@model/Lang';

export type ApiLang = Lang;

export interface ApiEntry {
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
}

export interface ApiEntryWithCustomValues extends ApiEntry {
    customValues: Record<CustomId, ApiCustomValue>;
}

export interface ApiCustomValue {
    definition: ApiCustomDef;
    text?: string;
    option?: OptionId;
    options?: OptionId[];
    table?: Record<TableCellId, string>;
}
export interface ApiCustomDef {
    id: CustomId;
    name: string;
    type: CustomType;
    partOfSpeech: PartOfSpeech;
    options?: Record<OptionId, string>;
    table?: Record<TableCellId, string>;
}

export function mapLang(lang: Lang): ApiLang {
    return lang;
}

export function mapEntry(entry: Entry): ApiEntry {
    return {
        id: entry.id,
        original: entry.original,
        translation: entry.translation,
        partOfSpeech: entry.partOfSpeech,
    };
}

export function mapEntryWithCustomValues(entry: Entry): ApiEntryWithCustomValues {
    return {
        ...mapEntry(entry),
        customValues: entry.customValues
            ? Object.fromEntries(
                  Array.from(entry.customValues).map(([customId, customValue]) => [
                      customId,
                      mapCustomValue(customValue),
                  ]),
              )
            : {},
    };
}

export function mapCustomValue(customValue: CustomValue): ApiCustomValue {
    return {
        definition: mapCustomDef(customValue.definition),
        ...(isTextCustomValue(customValue) && { text: customValue.text }),
        ...(isSingleOptionCustomValue(customValue) && { option: customValue.option }),
        ...(isMultiOptionCustomValue(customValue) && { options: customValue.options }),
        ...(isTableCustomValue(customValue) && { table: Object.fromEntries(customValue.table) }),
    };
}

export function mapCustomDef(customDef: CustomDef): ApiCustomDef {
    return {
        id: customDef.id,
        name: customDef.name,
        type: customDef.type,
        partOfSpeech: customDef.partOfSpeech,
        ...((isSingleOptionCustomDef(customDef) || isMultiOptionCustomDef(customDef)) && {
            options: Object.fromEntries(customDef.options),
        }),
        ...(isTableCustomDef(customDef) && {
            table: Object.fromEntries(
                Array.from(customDef.table)
                    .sort(([, cell1], [, cell2]) => cell1.index - cell2.index)
                    .map(([id, cell]) => [id, cell.name]),
            ),
        }),
    };
}
