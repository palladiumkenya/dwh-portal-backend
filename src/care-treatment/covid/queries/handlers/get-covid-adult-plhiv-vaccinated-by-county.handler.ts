import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByCountyQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {LineListCovid} from "../../entities/linelist-covid.model";

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
            adultPLHIVVaccinatedByCounty.andWhere('g.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByCounty.andWhere('g.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByCounty.andWhere('Sex IN (:...genders)', { genders: query.gender });
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
