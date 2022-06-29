import { FieldConfig } from 'directives/auth/types';

export const resolverReturnCatchedIf = (
    fieldConfig: FieldConfig,
    isNewFieldValue: (value: unknown) => boolean,
) => {
    const { resolve } = fieldConfig;

    fieldConfig.resolve = async (source, args, context, info) => {
        try {
            return await resolve?.(source, args, context, info);
        } catch (err) {
            if (isNewFieldValue(err)) {
                return err;
            }
            throw err;
        }
    };
};
