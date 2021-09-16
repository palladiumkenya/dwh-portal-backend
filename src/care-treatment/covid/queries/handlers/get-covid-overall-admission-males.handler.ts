import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallAdmissionMalesQuery } from '../impl/get-covid-overall-admission-males.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidOverallAdmissionMalesQuery)
export class GetCovidOverallAdmissionMalesHandler implements IQueryHandler<GetCovidOverallAdmissionMalesQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidOverallAdmissionMalesQuery): Promise<any> {
        const covidOverallAdmissionMales = this.repository.createQueryBuilder('f')
            .select(['AdmissionStatus, gender, CASE WHEN AdmissionStatus=\'Yes\' THEN \'Admitted\' WHEN AdmissionStatus=\'No\'  THEN \'Not Admitted\' ELSE \'Unclassified\' END as Admission, count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('PatientStatus=\'Symptomatic\' AND Gender =\'Male\'');

        if (query.county) {
            covidOverallAdmissionMales.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidOverallAdmissionMales.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidOverallAdmissionMales.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidOverallAdmissionMales.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await covidOverallAdmissionMales
            .groupBy('AdmissionStatus, Gender')
            .getRawMany();
    }
}
