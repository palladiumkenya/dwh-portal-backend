import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(
        private readonly cacheManager: Cache
    ) {}

    clearAll(): boolean {
        this.cacheManager.reset();
        return true;
    }
}
