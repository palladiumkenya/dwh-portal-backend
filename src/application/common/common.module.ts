import { Module } from '@nestjs/common';
import { DimFacility } from '../../entities/common/dim-facility.entity';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCountiesHandler } from './queries/handlers/get-counties.handler';
import { GetAgenciesHandler } from './queries/handlers/get-agencies.handler';
import { GetPartnersHandler } from './queries/handlers/get-partners.handler';
import { GetFacilitiesHandler } from './queries/handlers/get-facilities.handler';
import { CommonController } from './controllers/common.controller';
import { GetSubCountiesHandler } from './queries/handlers/get-sub-counties.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([DimFacility])],
    providers: [
        GetCountiesHandler,
        GetAgenciesHandler,
        GetPartnersHandler,
        GetFacilitiesHandler,
        GetSubCountiesHandler
    ],
    controllers: [CommonController],
})

export class CommonModule {

}
