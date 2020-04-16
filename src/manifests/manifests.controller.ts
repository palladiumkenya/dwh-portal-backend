import { Controller, Get } from '@nestjs/common';
import { ManifestsService } from './manifests.service';

@Controller('manifests')
export class ManifestsController {
    constructor(private manifestsService: ManifestsService) {}

    @Get()
    get() {
        return this.manifestsService.getAllManifests();
    }
}
