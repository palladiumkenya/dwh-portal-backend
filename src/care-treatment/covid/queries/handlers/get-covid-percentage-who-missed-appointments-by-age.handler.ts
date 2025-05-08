import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByAgeQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByAgeQuery)
export class GetCovidPercentageWhoMissedAppointmentsByAgeHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByAgeQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByAgeQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByAge = this.repository.createQueryBuilder('f')
            .select(['Agegroup, count (*) Num'])
            .where('MissedAppointmentDueToCOVID19=\'Yes\'');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPercentageWhoMissedAppointmentsByAge
            .groupBy('AgeGroup')
            .orderBy('AgeGroup')
            .getRawMany();
    }
}
