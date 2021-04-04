import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AppContext } from '@app/init';
import { isTableCustomDef, TableCellId, TableCustomDef } from '@model/CustomDef';
import { CustomDefInterfaceType } from './CustomDefInterfaceType';
import { PartOfSpeechEnumType } from './PartOfSpeechEnumType';
import { CustomTypeEnumType } from './CustomTypeEnumType';

export interface TableCellItem {
    id: TableCellId;
    name: string;
}

export const TableCellType = new GraphQLObjectType<TableCellItem, AppContext>({
    name: 'TableCell',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
});

export const TableCustomDefType: GraphQLObjectType<
    TableCustomDef,
    AppContext
> = new GraphQLObjectType<TableCustomDef, AppContext>({
    name: 'TableCustomDefinition',
    interfaces: () => [CustomDefInterfaceType],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        type: {
            type: GraphQLNonNull(CustomTypeEnumType),
        },
        partOfSpeech: {
            type: GraphQLNonNull(PartOfSpeechEnumType),
        },
        table: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TableCellType))),
            resolve: (tableCustomDef: TableCustomDef): TableCellItem[] => {
                return Array.from(tableCustomDef.table)
                    .sort(([, cell1], [, cell2]) => cell1.index - cell2.index)
                    .map(([id, cell]) => ({ id, name: cell.name }));
            },
        },
    },
    isTypeOf: isTableCustomDef,
});
