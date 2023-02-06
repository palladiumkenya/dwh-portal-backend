import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByCountyQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {LineListCovid} from "../../entities/linelist-covid.model";
//MARY - done
@QueryHandler(GetCovidAdultPlhivVaccinatedByCountyQuery)
export class GetCovidAdultPLHIVVaccinatedByCountyHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByCountyQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByCountyQuery): Promise<any> {
        const adultPLHIVVaccinatedByCounty = this.repository.createQueryBuilder('g')
            .select(['g.VaccinationStatus, g.County, Count (*) Num'])
            .where('g.TracingFinalOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByCounty.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByCounty.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByCounty.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByCounty.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByCounty.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            adultPLHIVVaccinatedByCounty.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        return await adultPLHIVVaccinatedByCounty
            .groupBy('g.County,g.VaccinationStatus')
            .orderBy('Count(*)', 'DESC')
            .getRawMany();
    }
}
