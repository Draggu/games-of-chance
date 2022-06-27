import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from 'helpers/get-request';
import { DataloaderPipe } from './dataloader.pipe';

const dataloadersSymbol = Symbol(
    'key on which are stored Dataloaders on req object',
);

declare module 'express' {
    interface Request {
        [dataloadersSymbol]?: Map<unknown, unknown>;
    }
}

/**
 * retrieves specified Dataloader from current Request
 * if not exists creates it
 */
export const Dataloader = () =>
    createParamDecorator((_, ctx: ExecutionContext) => {
        const req = getRequest(ctx);

        req[dataloadersSymbol] ||= new Map();

        return req[dataloadersSymbol];
    })(DataloaderPipe);
