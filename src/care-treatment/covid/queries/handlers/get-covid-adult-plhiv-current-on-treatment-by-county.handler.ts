import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByCountyQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByCountyQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByCountyHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByCountyQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByCountyQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByCounty = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, County']);

        if (query.county) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdultsCurrentOnTreatmentByCounty.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }


        return await covidAdultsCurrentOnTreatmentByCounty
            .groupBy('County')
            .getRawMany();
    }
}
