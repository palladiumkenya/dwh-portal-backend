import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdmissionByAgeQuery } from '../impl/get-covid-admission-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret
@QueryHandler(GetCovidAdmissionByAgeQuery)
export class GetCovidAdmissionByAgeHandler implements IQueryHandler<GetCovidAdmissionByAgeQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdmissionByAgeQuery): Promise<any> {
        const covidAdmissionByAge = this.repository
            .createQueryBuilder('f')
            .select(['AgeGroup, count (*) Num'])


            .where(
                "PatientStatus in ('Yes','Symptomatic') and AdmissionStatus='Yes'",
            );

        if (query.county) {
            covidAdmissionByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdmissionByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdmissionByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdmissionByAge.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdmissionByAge.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdmissionByAge.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdmissionByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidAdmissionByAge
            .groupBy('AgeGroup')
            .getRawMany();
    }
}
