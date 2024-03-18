import { Controller, Get, Inject } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
    constructor(
        @Inject(CacheService) private readonly cacheService: CacheService
    ) { }

    @Get('invalidate-cache')
    invalidateAllCaches(): { success: boolean } {
        // Clear all caches
        this.cacheService.clearAll();

        return { success: true };
    }
}
