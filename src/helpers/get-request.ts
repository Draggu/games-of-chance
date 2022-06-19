import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const getRequest = (context: ExecutionContext): Request => {
    const contextType = context.getType<GqlContextType>();

    if (contextType === 'http') {
        return context.switchToHttp().getRequest();
    }

    if (contextType === 'graphql') {
        return GqlExecutionContext.create(context).getContext().req;
    }

    throw new Error(`unsupported context type (${contextType})`);
};
