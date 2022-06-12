import { SetMetadata } from '@nestjs/common';

export const DISABLE_AUTH = 'DISABLE_AUTH';

export const DisableAuth = () => SetMetadata(DISABLE_AUTH, true);
