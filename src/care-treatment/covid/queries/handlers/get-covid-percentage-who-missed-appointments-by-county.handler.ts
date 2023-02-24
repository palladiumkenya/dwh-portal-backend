import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByCountyQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByCountyQuery)
export class GetCovidPercentageWhoMissedAppointmentsByCountyHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByCountyQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByCountyQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByCounty = this.repository.createQueryBuilder('f')
            .select(['County, count (*)Num'])
            .where('MissedAppointmentDueToCOVID19=\'Yes\' AND County IS NOT NULL');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPercentageWhoMissedAppointmentsByCounty
            .groupBy('f.County')
            .getRawMany();
    }
}
