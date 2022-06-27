import { CurrentUser } from './types';

export const currentUserSymbol = Symbol('current user key on ctx');

export const userPromiseSymbol = Symbol('user promise on req');

export const ownershipKey = 'ownershipKey';

declare module 'express' {
    interface Request {
        [currentUserSymbol]?: CurrentUser;
        [userPromiseSymbol]?: Promise<CurrentUser | undefined>;
    }
}
