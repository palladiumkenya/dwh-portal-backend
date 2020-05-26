import { Module } from '@nestjs/common';
import { DimFacility } from '../../entities/common/dim-facility.entity';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetTilesHandler } from './queries/handlers/get-tiles.handler';
import { ManifestsController } from './controllers/manifests.controller';
import { FactManifest } from '../../entities/manifests/fact-manifest.entity';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([FactManifest])],
    providers: [
        GetTilesHandler
    ],
    controllers: [ManifestsController],
})

export class ManifestsModule {

}
