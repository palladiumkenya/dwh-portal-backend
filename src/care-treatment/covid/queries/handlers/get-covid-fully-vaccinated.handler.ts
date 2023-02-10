import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidFullyVaccinatedQuery } from '../impl/get-covid-fully-vaccinated.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import {AggregateCovid} from "../../entities/aggregate-covid.model";
import {LineListCovid} from "../../entities/linelist-covid.model";
//MARY - done
@QueryHandler(GetCovidFullyVaccinatedQuery)
export class GetCovidFullyVaccinatedHandler implements IQueryHandler<GetCovidFullyVaccinatedQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidFullyVaccinatedQuery): Promise<any> {
        const covidFullyVaccinated = this.repository.createQueryBuilder('f')
            .select(['Count (*) FullyVaccinated'])
            .where(' f.VaccinationStatus=\'Fully Vaccinated\' ');

        if (query.county) {
            covidFullyVaccinated.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidFullyVaccinated.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidFullyVaccinated.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidFullyVaccinated.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidFullyVaccinated.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidFullyVaccinated.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            covidFullyVaccinated.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        return await covidFullyVaccinated.getRawOne();
    }
}
