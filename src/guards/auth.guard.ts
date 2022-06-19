import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as assert from 'assert';
import { CurrentUserKey } from 'decorators/current-user.decorator';
import { DISABLE_AUTH } from 'decorators/disable-auth.decorator';
import { Request } from 'express';
import { getRequest } from 'helpers/get-request';
import { AuthService } from 'modules/auth/auth.service';

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

        try {
            await this.setUserFromToken(getRequest(context));

            return true;
        } catch (e) {
            this.logger.error(e.message);

            return false;
        }
    }

    private setUserFromToken(req: Request) {
        const token = this.tokenFromRequest(req);

        assert(token);

        return this.setUserOnContext(req, token);
    }

    private tokenFromRequest = (req: Request) =>
        req.header('Authorization')?.replace('Bearer ', '');

    private async setUserOnContext(ctx: Request, token: string) {
        const { id } = await this.authService.fromToken(token);

        ctx[CurrentUserKey] = { id };
    }
}
