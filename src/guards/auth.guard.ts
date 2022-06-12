import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'modules/auth/auth.service';
import { Request } from 'express';
import assert from 'assert';
import { CurrentUserKey } from 'decorators/current-user.decorator';
import { Reflector } from '@nestjs/core';
import { DISABLE_AUTH } from 'decorators/disable-auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    logger = new Logger(AuthGuard.name);

    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const isAuthDisabled = this.reflector.getAllAndOverride<boolean>(
            DISABLE_AUTH,
            [context.getHandler(), context.getClass()],
        );

        if (isAuthDisabled) {
            return true;
        }

        const contextType = context.getType<GqlContextType>();

        if (contextType === 'http') {
            const request: Request = context.getArgByIndex(0);
            const token = this.tokenFromRequest(request);

            await this.setUserOnContext(context, token);
        } else if (contextType === 'graphql') {
            const request: Request =
                GqlExecutionContext.create(context).getContext().req;
            const token = this.tokenFromRequest(request);

            await this.setUserOnContext(context, token);
        } else {
            this.logger.error(
                `${AuthGuard.name} received unsupported context type (${contextType})`,
            );

            return false;
        }

        return true;
    }

    private tokenFromRequest = (req: Request) =>
        req.header('Authorization')?.replace('Bearer ', '');

    private async setUserOnContext(ctx: ExecutionContext, token?: string) {
        assert(token);

        const user = await this.authService.fromToken(token);

        Object.assign(ctx, {
            [CurrentUserKey]: user,
        });
    }
}
