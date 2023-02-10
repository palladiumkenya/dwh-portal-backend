import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPartiallyVaccinatedQuery } from '../impl/get-covid-partially-vaccinated.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidPartiallyVaccinatedQuery)
export class GetCovidPartiallyVaccinatedHandler implements IQueryHandler<GetCovidPartiallyVaccinatedQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidPartiallyVaccinatedQuery): Promise<any> {
        const covidPartiallyVaccinated = this.repository.createQueryBuilder('f')
            .select(['Count (*) PartiallyVaccinated'])
            .where('f.VaccinationStatus=\'Partially Vaccinated\' ');

        if (query.county) {
            covidPartiallyVaccinated.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPartiallyVaccinated.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPartiallyVaccinated.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPartiallyVaccinated.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPartiallyVaccinated.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPartiallyVaccinated.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPartiallyVaccinated.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPartiallyVaccinated.getRawOne();
    }
}
