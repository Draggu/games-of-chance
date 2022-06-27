import { applyDecorators } from '@nestjs/common';
import { Directive, Extensions } from '@nestjs/graphql';
import { ownershipKey } from '../consts';
import { prepareAuthDirective } from '../prepare';
import { OwnershipMetadata, OwnershipTarget } from '../types';

/**
 * @param field describes field that will be compared with userId
 * @param on describes which object should be used (returned by resolver or parent)
 */
export const Ownership = (field = 'userId', on = OwnershipTarget.PARENT) => {
    // forces typesafety
    const metadata: OwnershipMetadata = { field, on };

    return applyDecorators(
        Extensions({
            [ownershipKey]: metadata,
        }),
        Directive(
            prepareAuthDirective({
                onlyOwn: true,
            }),
        ),
    );
};
