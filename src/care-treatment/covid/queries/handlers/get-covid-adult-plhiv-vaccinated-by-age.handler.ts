import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPLHIVVaccinatedByAgeQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {LineListCovid} from "../../entities/linelist-covid.model";
//MARY -done
@QueryHandler(GetCovidAdultPLHIVVaccinatedByAgeQuery)
export class GetCovidAdultPLHIVVaccinatedByAgeHandler implements IQueryHandler<GetCovidAdultPLHIVVaccinatedByAgeQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPLHIVVaccinatedByAgeQuery): Promise<any> {
        const adultPLHIVVaccinatedByAge = this.repository.createQueryBuilder('f')
            .select(['f.VaccinationStatus, AgeGroup, Count (*) Num'])
            .where('TracingFinalOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByAge.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByAge.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByAge.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            adultPLHIVVaccinatedByAge.andWhere(
                'AgeGroup IN (:...ageGroups)',
                { ageGroups: query.ageGroup },
            );
        }

        return await adultPLHIVVaccinatedByAge
            .groupBy('AgeGroup,f.VaccinationStatus')
            .getRawMany();
    }
}
