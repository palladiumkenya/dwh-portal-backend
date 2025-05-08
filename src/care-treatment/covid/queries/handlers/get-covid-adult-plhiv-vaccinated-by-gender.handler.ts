import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByGenderQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {LineListCovid} from "../../entities/linelist-covid.model";

@QueryHandler(GetCovidAdultPlhivVaccinatedByGenderQuery)
export class GetCovidAdultPLHIVVaccinatedByGenderHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByGenderQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByGenderQuery): Promise<any> {
        const adultPLHIVVaccinatedByGender = this.repository.createQueryBuilder('g')
            .select(['g.VaccinationStatus, g.Sex gender, Count (*) Num'])

        if (query.county) {
            adultPLHIVVaccinatedByGender.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByGender.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByGender.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByGender.andWhere('g.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByGender.andWhere('g.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByGender.andWhere('Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            adultPLHIVVaccinatedByGender.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        return await adultPLHIVVaccinatedByGender
            .groupBy('g.Sex, g.VaccinationStatus')
            .getRawMany();
    }
}
