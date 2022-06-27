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
} from '../types';

export const onlyOwnNullableTypes = (fieldConfig: FieldConfig) => {
    const { type } = fieldConfig;
    // all fields that have ownership must be nullable
    fieldConfig.type = isNonNullType(type) ? type.ofType : type;
};

export const onlyOwnRule =
    (parent: Result, info: GraphQLResolveInfo, user?: CurrentUser) =>
    (result: Result, directiveArgs: AuthProperties) => {
        if (!directiveArgs.onlyOwn) {
            return result;
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

        const ownerId: string | undefined =
            extension.on === OwnershipTarget.SELF
                ? result[extension.field]
                : parent[extension.field];

        return user && user.id === ownerId ? result : null;
    };
