import { FieldConfig } from 'directives/auth/types';
import {
    assertObjectType,
    GraphQLSchema,
    GraphQLUnionType,
    isNonNullType,
    isObjectType,
    isUnionType,
} from 'graphql';

export const addTypeToField = ({
    schema,
    fieldConfig,
    extraFieldName,
    directiveName,
    isNewFieldValue,
}: {
    schema: GraphQLSchema;
    fieldConfig: FieldConfig;
    extraFieldName: string;
    directiveName: string;
    isNewFieldValue: (value: unknown) => boolean;
}) => {
    const type = isNonNullType(fieldConfig.type)
        ? fieldConfig.type.ofType
        : fieldConfig.type;
    const newType = assertObjectType(schema.getType(extraFieldName));

    if (isUnionType(type)) {
        const { types, name, resolveType, ...config } = type.toConfig();

        fieldConfig.type = new GraphQLUnionType({
            ...config,
            types: [...types, newType],
            name: `${name}Or${newType.name}`,
            resolveType: (value: unknown, context, info, abstractType) =>
                isNewFieldValue(value)
                    ? newType.name
                    : resolveType!(value, context, info, abstractType),
        });
    } else if (isObjectType(type)) {
        const name = `${type.name}Or${newType.name}`;

        fieldConfig.type = new GraphQLUnionType({
            types: [type, newType],
            name,
            resolveType: (value: unknown) =>
                isNewFieldValue(value) ? newType.name : type.name,
        });
    } else {
        throw new Error(`
            unsupported type for @${directiveName} directive
            exptected union or object type
            received: ${type}
        `);
    }
};
