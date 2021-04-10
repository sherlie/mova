import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { AppContext } from '@app/init';
import { isTableCustomValue, TableCustomValue } from '@model/CustomValue';
import { CustomValueInterfaceType } from './CustomValueInterfaceType';
import { CustomDefUnionType } from './CustomDefUnionType';
import { TableCellId } from '@model/CustomDef';

export interface TableCellValue {
    id: TableCellId;
    name: string;
    value: string;
}

export const TableCellType = new GraphQLObjectType<TableCellValue, AppContext>({
    name: 'TableCellValue',
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
        },
        value: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
});

export const TableCustomValueType: GraphQLObjectType<
    TableCustomValue,
    AppContext
> = new GraphQLObjectType<TableCustomValue, AppContext>({
    name: 'TableCustomValue',
    interfaces: () => [CustomValueInterfaceType],
    fields: {
        definition: {
            type: GraphQLNonNull(CustomDefUnionType),
        },
        cells: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TableCellType))),
            resolve: (tableCustomValue: TableCustomValue): TableCellValue[] => {
                const {
                    cells,
                    definition: { table },
                } = tableCustomValue;

                return (
                    Object.entries<string>(cells)
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        .sort(([id1], [id2]) => table.get(id1)!.index - table.get(id2)!.index)
                        .map(([id, value]) => ({
                            id,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            name: table.get(id)!.name,
                            value,
                        }))
                );
            },
        },
    },
    isTypeOf: isTableCustomValue,
});
