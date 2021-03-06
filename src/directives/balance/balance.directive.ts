import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { FieldConfig } from 'directives/auth/types';
import { addTypeToField } from 'helpers/schema/add-type';
import { resolverReturnCatchedIf } from 'helpers/schema/resolver-return-catched-if';
import { SchemaTransform } from 'helpers/schema/transform';
import { BalanceTooLowError } from './balance-to-low.error';

const isNewFieldValue = (value: unknown) => value instanceof BalanceTooLowError;
@Injectable()
export class BalanceDirective implements GqlDirectiveFactory {
    readonly typeDefs = /* GraphQL */ `
        """
        requires balance to be high enough
        if it's too low returns BalanceTooLowError
        """
        directive @balance on FIELD_DEFINITION
    `;

    create(): SchemaTransform {
        return (schema) =>
            mapSchema(schema, {
                [MapperKind.FIELD]: (fieldConfig: FieldConfig) => {
                    const directiveArgs = getDirective(
                        schema,
                        fieldConfig,
                        'balance',
                    )?.[0];

                    if (directiveArgs) {
                        addTypeToField({
                            schema,
                            fieldConfig,
                            extraFieldName: BalanceTooLowError.name,
                            directiveName: 'balance',
                            isNewFieldValue,
                        });

                        resolverReturnCatchedIf(fieldConfig, isNewFieldValue);
                    }

                    return fieldConfig;
                },
            });
    }
}
