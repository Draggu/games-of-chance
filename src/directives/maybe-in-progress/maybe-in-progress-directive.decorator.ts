import { Directive } from '@nestjs/graphql';

export const MaybeInProgressDirective = () => Directive('@maybeInProgress');
