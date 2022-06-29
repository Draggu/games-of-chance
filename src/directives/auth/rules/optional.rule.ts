import { AuthProperties, CurrentUser, RuleNext } from '../types';

export const optionalRule =
    (user: CurrentUser | undefined) =>
    (next: RuleNext, authProperties: AuthProperties) =>
    () =>
        authProperties.optional || !!user ? next() : null;
