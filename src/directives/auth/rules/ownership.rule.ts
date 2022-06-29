import * as assert from 'assert';
import { GraphQLResolveInfo, isNonNullType } from 'graphql';
import { ownershipKey } from '../consts';
import {
    AuthProperties,
    CurrentUser,
    FieldConfig,
    OwnershipMetadata,
    OwnershipTarget,
    Result,
    RuleNext,
} from '../types';

export const ownershipNullableTypes = (fieldConfig: FieldConfig) => {
    const { type } = fieldConfig;
    // all fields that have ownership must be nullable
    fieldConfig.type = isNonNullType(type) ? type.ofType : type;
};

export const ownershipRule =
    (parent: Result, info: GraphQLResolveInfo, user?: CurrentUser) =>
    (next: RuleNext, directiveArgs: AuthProperties) =>
    async () => {
        if (!directiveArgs.onlyOwn) {
            return next();
        }

        const extension = Object.entries(info.parentType.getFields())
            .filter(([fieldName]) => fieldName === info.fieldName)
            .map(
                ([_, { extensions }]) =>
                    extensions[ownershipKey] ||
                    info.parentType.extensions[ownershipKey],
            )[0] as OwnershipMetadata | undefined;

        assert(
            extension,
            `@auth(ownership=true) has missing extension data on ${info.parentType.name}#${info.fieldName}`,
        );

        const ifAccessGranted = (
            ownerId: string | undefined,
            result: ReturnType<RuleNext>,
        ) => (user && user.id === ownerId ? result : null);

        if (extension.on === OwnershipTarget.SELF) {
            const result = await next();

            return ifAccessGranted(result?.[extension.field], result);
        }

        return ifAccessGranted(parent[extension.field], next());
    };
