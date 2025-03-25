import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidSeverityByGenderQuery } from '../impl/get-covid-severity-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from '../../entities/linelist-covid.model';

@QueryHandler(GetCovidSeverityByGenderQuery)
export class GetCovidSeverityByGenderHandler implements IQueryHandler<GetCovidSeverityByGenderQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidSeverityByGenderQuery): Promise<any> {
        const covidSeverityByGender = this.repository
            .createQueryBuilder('g')
            .select([
                'PatientStatus, Sex Gender, Case ' +
                    "When PatientStatus='No' then 'Asymptomatic' " +
                    "When PatientStatus= 'Yes' then 'Symptomatic' " +
                    'Else PatientStatus end as PatientStatusComputed, ' +
                    'count (*) Num',
            ])
            .where('PatientStatus is not null ');

        if (query.county) {
            covidSeverityByGender.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidSeverityByGender.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidSeverityByGender.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidSeverityByGender.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidSeverityByGender.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidSeverityByGender.andWhere('Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidSeverityByGender.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidSeverityByGender
            .groupBy('Sex, PatientStatus')
            .getRawMany();
    }
}
