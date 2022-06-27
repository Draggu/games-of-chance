import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';
import { UserEntity } from 'modules/user/entities/user.entity';

export interface AuthProperties {
    optional?: boolean;
    onlyOwn?: boolean;
}

export type CurrentUser = Pick<UserEntity, 'id'>;

export type Result = Record<string, string | undefined>;

export type OwnershipMetadata = {
    field: string;
    on: OwnershipTarget;
};

export type FieldConfig = GraphQLFieldConfig<Result, { req: Request }, unknown>;

export enum OwnershipTarget {
    SELF = 'self',
    PARENT = 'parent',
}
