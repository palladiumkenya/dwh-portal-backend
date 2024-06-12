import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-age-group.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByAgeGroupHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByAgeGroup = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, AgeGroup']);

        if (query.county) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await covidAdultsCurrentOnTreatmentByAgeGroup
            .groupBy('AgeGroup')
            .getRawMany();
    }
}
