import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallAdmissionFemalesQuery } from '../impl/get-covid-overall-admission-females.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { GetCovidOverallAdmissionMalesQuery } from '../impl/get-covid-overall-admission-males.query';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidOverallAdmissionFemalesQuery)
export class GetCovidOverallAdmissionFemalesHandler implements IQueryHandler<GetCovidOverallAdmissionFemalesQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidOverallAdmissionMalesQuery): Promise<any> {
        const covidOverallAdmissionFemales = this.repository.createQueryBuilder('f')
            .select(['AdmissionStatus, gender, CASE WHEN AdmissionStatus=\'Yes\' THEN \'Admitted\' WHEN AdmissionStatus=\'No\'  THEN \'Not Admitted\' ELSE \'Unclassified\' END as Admission, count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('PatientStatus=\'Symptomatic\' AND Gender =\'Female\'');

        if (query.county) {
            covidOverallAdmissionFemales.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidOverallAdmissionFemales.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidOverallAdmissionFemales.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidOverallAdmissionFemales.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await covidOverallAdmissionFemales
            .groupBy('AdmissionStatus, Gender')
            .getRawMany();
    }
}
