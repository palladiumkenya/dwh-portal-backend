import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidSeverityByGenderQuery } from '../impl/get-covid-severity-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidSeverityByGenderQuery)
export class GetCovidSeverityByGenderHandler implements IQueryHandler<GetCovidSeverityByGenderQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidSeverityByGenderQuery): Promise<any> {
        const covidSeverityByGender = this.repository.createQueryBuilder('g')
            .select(['PatientStatus, g.Gender, Case ' +
            'When PatientStatus=\'No\' then \'Asymptomatic\' ' +
            'When PatientStatus= \'Yes\' then \'Symptomatic\' ' +
            'Else Null end as PatientStatusComputed, ' +
            'count (*)Num'])
            .leftJoin(FactTransCovidVaccines, 'f', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            // .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('PatientStatus is not null and ARTOutcome = \'V\'');

        if (query.county) {
            covidSeverityByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidSeverityByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidSeverityByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidSeverityByGender.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidSeverityByGender.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidSeverityByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidSeverityByGender.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidSeverityByGender
            .groupBy('g.Gender, PatientStatus')
            .getRawMany();
    }
}
