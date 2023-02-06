import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidSeverityByGenderQuery } from '../impl/get-covid-severity-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from './../../entities/linelist-covid.model';

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
                'PatientStatus, Gender, Case ' +
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
            covidSeverityByGender.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidSeverityByGender.andWhere('CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidSeverityByGender.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidSeverityByGender.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidSeverityByGender
            .groupBy('Gender, PatientStatus')
            .getRawMany();
    }
}
