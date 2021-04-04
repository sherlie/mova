import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { AppContext } from '@app/init';
import { isMultiOptionCustomValue, MultiOptionCustomValue } from '@model/CustomValue';
import { CustomValueInterfaceType } from './CustomValueInterfaceType';
import { CustomDefUnionType } from './CustomDefUnionType';
import { Option, OptionType } from './OptionCustomDefType';

export const MultiOptionCustomValueType: GraphQLObjectType<
    MultiOptionCustomValue,
    AppContext
> = new GraphQLObjectType<MultiOptionCustomValue, AppContext>({
    name: 'MultiOptionCustomValue',
    interfaces: () => [CustomValueInterfaceType],
    fields: {
        definition: {
            type: GraphQLNonNull(CustomDefUnionType),
        },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionType))),
            resolve: (multiOptCustomValue: MultiOptionCustomValue): Option[] => {
                const { options: optionIds, definition } = multiOptCustomValue;
                return optionIds.map((optionId) => ({
                    id: optionId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    value: definition.options.get(optionId)!,
                }));
            },
        },
    },
    isTypeOf: isMultiOptionCustomValue,
});
