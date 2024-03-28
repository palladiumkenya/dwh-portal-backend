import { Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

@Injectable()
export class AppService {
    // constructor(private readonly cacheService: CacheService) {
    // }
    getHello(): string {
        return 'Hello World!';
    }
    // deleteCaches(): boolean {
    //     return this.cacheService.clearAll();
    // }
}
