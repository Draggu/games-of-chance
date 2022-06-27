import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as assert from 'assert';

@Injectable()
export class DataloaderPipe implements PipeTransform {
    constructor(private readonly moduleRef: ModuleRef) {}

    async transform(
        dataloadersMap: Map<unknown, unknown>,
        { metatype }: ArgumentMetadata,
    ) {
        assert(metatype);

        if (!dataloadersMap.has(metatype)) {
            const dataloader = this.moduleRef.create(metatype);
            // keep promise to have one instance (concurency)
            dataloadersMap.set(metatype, dataloader);
        }

        const dataloader = await dataloadersMap.get(metatype);

        return dataloader;
    }
}
