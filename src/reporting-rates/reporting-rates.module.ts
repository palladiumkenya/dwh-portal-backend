import { Module } from '@nestjs/common';
import { ReportingRatesController } from './reporting-rates.controller';
import { ReportingRatesService } from './reporting-rates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manifest } from '../entities/manifest.entity';
import { MasterfacilitiesEntity } from '../entities/masterfacilities.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Manifest, MasterfacilitiesEntity])],
    controllers: [ReportingRatesController],
    providers: [ReportingRatesService],
})
export class ReportingRatesModule {}
