import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidSymptomaticInfectionsQuery } from '../impl/get-covid-symptomatic-infections.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidSymptomaticInfectionsQuery)
export class GetCovidSymptomaticInfectionsHandler implements IQueryHandler<GetCovidSymptomaticInfectionsQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidSymptomaticInfectionsQuery): Promise<any> {
        const covidSymptomaticInfections = this.repository
            .createQueryBuilder('f')
            .select(['count(*) Num'])
            .where(
                "EverCOVID19Positive='Yes' and PatientStatus in ('Yes','Symptomatic')",
            );

        if (query.county) {
            covidSymptomaticInfections.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidSymptomaticInfections.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidSymptomaticInfections.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidSymptomaticInfections.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidSymptomaticInfections.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidSymptomaticInfections.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidSymptomaticInfections.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidSymptomaticInfections.getRawOne();
    }
}
