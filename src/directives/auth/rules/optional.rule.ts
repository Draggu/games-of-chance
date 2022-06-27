import { AuthProperties, CurrentUser, Result } from '../types';

export const optionalRule =
    (user: CurrentUser | undefined) =>
    (result: Result, directiveArgs: AuthProperties) =>
        directiveArgs.optional || !!user ? result : null;
