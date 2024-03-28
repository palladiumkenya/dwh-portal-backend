import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
    providers: [
        CacheService,
    ],
    exports: [CacheService],
})

export class CachesModule {

}
