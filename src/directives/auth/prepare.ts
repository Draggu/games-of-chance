import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { AuthProperties } from './types';

export const prepareAuthDirective = (authProperties?: AuthProperties) =>
    jsonToGraphQLQuery({ '@auth': { __args: authProperties } });
