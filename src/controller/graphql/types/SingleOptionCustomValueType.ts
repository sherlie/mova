import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { AppContext } from '@app/init';
import { isSingleOptionCustomValue, SingleOptionCustomValue } from '@model/CustomValue';
import { CustomValueInterfaceType } from './CustomValueInterfaceType';
import { CustomDefUnionType } from './CustomDefUnionType';
import { Option, OptionType } from './OptionCustomDefType';

export const SingleOptionCustomValueType: GraphQLObjectType<
    SingleOptionCustomValue,
    AppContext
> = new GraphQLObjectType<SingleOptionCustomValue, AppContext>({
    name: 'SingleOptionCustomValue',
    interfaces: () => [CustomValueInterfaceType],
    fields: {
        definition: {
            type: GraphQLNonNull(CustomDefUnionType),
        },
        option: {
            type: GraphQLNonNull(OptionType),
            resolve: (singleOptCustomValue: SingleOptionCustomValue): Option => {
                const { option: optionId, definition } = singleOptCustomValue;
                return {
                    id: optionId,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    value: definition.options.get(optionId)!,
                };
            },
        },
    },
    isTypeOf: isSingleOptionCustomValue,
});
