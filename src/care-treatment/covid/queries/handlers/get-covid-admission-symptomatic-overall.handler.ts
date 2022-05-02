import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdmissionByAgeQuery } from '../impl/get-covid-admission-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {GetCovidAdmissionSymptomaticOverallQuery} from "../impl/get-covid-admission-symptomatic-overall.query";

@QueryHandler(GetCovidAdmissionSymptomaticOverallQuery)
export class GetCovidAdmissionSymptomaticOverallHandler implements IQueryHandler<GetCovidAdmissionSymptomaticOverallQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidAdmissionSymptomaticOverallQuery): Promise<any> {
        const covidAdmissionSymptomaticOverall = this.repository.createQueryBuilder('f')
            .select(['AdmissionStatus, CASE WHEN AdmissionStatus=\'Yes\' THEN \'Admitted\' WHEN AdmissionStatus=\'No\' THEN \'Not Admitted\' ELSE \'Unclassified\' END as Admission, count (*)Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ARTOutcome=\'V\' and PatientStatus=\'Yes\'');

        if (query.county) {
            covidAdmissionSymptomaticOverall.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdmissionSymptomaticOverall.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdmissionSymptomaticOverall.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdmissionSymptomaticOverall.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdmissionSymptomaticOverall.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdmissionSymptomaticOverall.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdmissionSymptomaticOverall.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidAdmissionSymptomaticOverall
            .groupBy('AdmissionStatus')
            .getRawMany();
    }
}
