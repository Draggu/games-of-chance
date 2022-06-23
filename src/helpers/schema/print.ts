import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { GRAPHQL_SDL_FILE_HEADER } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { GraphQLSchema } from 'graphql';

export const printSchemaToFile = (file: string) => (schema: GraphQLSchema) =>
    writeFileSync(
        file,
        GRAPHQL_SDL_FILE_HEADER + printSchemaWithDirectives(schema),
    );
