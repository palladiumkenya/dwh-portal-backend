import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manifest } from 'src/entities/manifest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManifestsService {
    constructor(
        @InjectRepository(Manifest)
        private manifestRepository: Repository<Manifest>,
    ) {}

    async getAllManifests() {
        return await this.manifestRepository.find();
    }
}
