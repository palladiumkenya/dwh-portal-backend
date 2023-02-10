import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdmissionByAgeQuery } from '../impl/get-covid-admission-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {GetCovidAdmissionSymptomaticOverallQuery} from "../impl/get-covid-admission-symptomatic-overall.query";
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret
@QueryHandler(GetCovidAdmissionSymptomaticOverallQuery)
export class GetCovidAdmissionSymptomaticOverallHandler implements IQueryHandler<GetCovidAdmissionSymptomaticOverallQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdmissionSymptomaticOverallQuery): Promise<any> {
        const covidAdmissionSymptomaticOverall = this.repository.createQueryBuilder('f')
            .select(['AdmissionStatus, CASE WHEN AdmissionStatus=\'Yes\' THEN \'Admitted\' WHEN AdmissionStatus=\'No\' THEN \'Not Admitted\' ELSE \'Unclassified\' END as Admission, count (*)Num'])
            .where('PatientStatus in (\'Yes\',\'Symptomatic\')');

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
            covidAdmissionSymptomaticOverall.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdmissionSymptomaticOverall.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdmissionSymptomaticOverall.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdmissionSymptomaticOverall.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidAdmissionSymptomaticOverall
            .groupBy('AdmissionStatus')
            .getRawMany();
    }
}
