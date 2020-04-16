import { Module } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { ManifestsController } from './manifests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manifest } from 'src/entities/manifest.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Manifest])],
    providers: [ManifestsService],
    controllers: [ManifestsController],
})
export class ManifestsModule {}
