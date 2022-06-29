import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { FieldConfig } from 'directives/auth/types';
import { addTypeToField } from 'helpers/schema/add-type';
import { resolverReturnCatchedIf } from 'helpers/schema/resolver-return-catched-if';
import { SchemaTransform } from 'helpers/schema/transform';
import { InProgressError } from './in-progress.error';

const isNewFieldValue = (value: unknown) => value instanceof InProgressError;

@Injectable()
export class MaybeInProgressDirective implements GqlDirectiveFactory {
    readonly typeDefs = /* GraphQL */ `
        directive @maybeInProgress on FIELD_DEFINITION
    `;

    create(): SchemaTransform {
        return (schema) =>
            mapSchema(schema, {
                [MapperKind.FIELD]: (fieldConfig: FieldConfig) => {
                    const directiveArgs = getDirective(
                        schema,
                        fieldConfig,
                        'maybeInProgress',
                    )?.[0];

                    if (directiveArgs) {
                        addTypeToField({
                            schema,
                            fieldConfig,
                            extraFieldName: InProgressError.name,
                            directiveName: 'maybeInProgress',
                            isNewFieldValue,
                        });

                        resolverReturnCatchedIf(fieldConfig, isNewFieldValue);
                    }

                    return fieldConfig;
                },
            });
    }
}
