import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

type Transforms = ((schema: GraphQLSchema) => GraphQLSchema)[];

const callTransforms = (transforms: Transforms, schema: GraphQLSchema) =>
    transforms.reduce((schema, transform) => transform(schema), schema);
/**
 * typeDefs -> beforePrint -> print -> afterPrint
 * we use this order to allow manipulating schema
 * with implementation details that should not be
 * reflected in printed schema
 */
export const transformSchema =
    ({
        beforePrint,
        afterPrint,
        typeDefs,
        print,
    }: {
        beforePrint: Transforms;
        afterPrint: Transforms;
        typeDefs: string[];
        print: (schema: GraphQLSchema) => void;
    }) =>
    (schema: GraphQLSchema) => {
        const firstTransform = callTransforms(
            beforePrint,
            mergeSchemas({
                schemas: [schema],
                typeDefs,
            }),
        );

        print(firstTransform);

        return callTransforms(afterPrint, firstTransform);
    };
