import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType,
    GraphQLFieldResolver,
} from 'graphql';
import { AppContext } from '@app/init';

class AppError extends Error {
    constructor(public message: string) {
        super(message);
    }
}

export type Result<T> = T | AppError;

export const ErrorType = new GraphQLObjectType<AppError, AppContext>({
    name: 'Error',
    fields: {
        message: {
            type: GraphQLNonNull(GraphQLString),
        },
    },
});

export const getResultType = (
    name: string,
    type: GraphQLObjectType | GraphQLUnionType,
): GraphQLUnionType => {
    const types =
        type instanceof GraphQLUnionType ? [...type.getTypes(), ErrorType] : [type, ErrorType];

    return new GraphQLUnionType({
        name,
        types,
        resolveType: (source, context, info, abstractType) => {
            if (source instanceof AppError) {
                return ErrorType;
            }

            if (type instanceof GraphQLUnionType) {
                return type.resolveType
                    ? type.resolveType(source, context, info, abstractType)
                    : types.find((type) => type.isTypeOf && type.isTypeOf(source, context, info));
            }

            return type;
        },
    });
};

export const getResultResolver = <TSource, TContext>(
    resolver: GraphQLFieldResolver<TSource, TContext>,
): GraphQLFieldResolver<TSource, TContext> => {
    return async (source, args, context, info) => {
        try {
            return await resolver(source, args, context, info);
        } catch (error) {
            return new AppError(error);
        }
    };
};
