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
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidSeverityByGenderQuery): Promise<any> {
        const covidSeverityByGender = this.repository.createQueryBuilder('f')
            .select(['Gender, PatientStatus, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ARTOutcome=\'V\'');

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

        return await covidSeverityByGender
            .groupBy('Gender,PatientStatus')
            .getRawMany();
    }
}
