import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByGenderQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByGenderQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByGenderHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByGenderQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByGenderQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByGender = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, Gender']);

        if (query.county) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdultsCurrentOnTreatmentByGender.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }


        return await covidAdultsCurrentOnTreatmentByGender
            .groupBy('Gender')
            .getRawMany();
    }
}
