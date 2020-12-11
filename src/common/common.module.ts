import { Module } from '@nestjs/common';
import { DimFacility } from './entities/dim-facility.entity';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCountiesHandler } from './queries/handlers/get-counties.handler';
import { GetSubCountiesHandler } from './queries/handlers/get-sub-counties.handler';
import { GetFacilitiesHandler } from './queries/handlers/get-facilities.handler';
import { GetPartnersHandler } from './queries/handlers/get-partners.handler';
import { GetAgenciesHandler } from './queries/handlers/get-agencies.handler';
import { GetSitesHandler } from './queries/handlers/get-sites.handler';
import { CommonController } from './common.controller';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([DimFacility])],
    providers: [
        GetCountiesHandler,
        GetSubCountiesHandler,
        GetFacilitiesHandler,
        GetPartnersHandler,
        GetAgenciesHandler,
        GetSitesHandler,
    ],
    controllers: [CommonController],
})

export class CommonModule {

}
