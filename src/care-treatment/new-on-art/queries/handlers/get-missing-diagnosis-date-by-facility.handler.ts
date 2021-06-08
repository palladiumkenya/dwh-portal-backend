import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../entities/fact-trans-new-cohort.model';
import { GetMissingDiagnosisDateByFacilityQuery } from '../impl/get-missing-diagnosis-date-by-facility.query';

@QueryHandler(GetMissingDiagnosisDateByFacilityQuery)
export class GetMissingDiagnosisDateByFacilityHandler implements IQueryHandler<GetMissingDiagnosisDateByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetMissingDiagnosisDateByFacilityQuery): Promise<any> {
        const missingDiagnosisDateByFacility = this.repository.createQueryBuilder('f')
            .select(['MFLCode mfl, FacilityName facility, County county, SubCounty subCounty, CTPartner partner, COUNT(*) patients'])
            .where('MFLCode > 0')
            .andWhere('TimeToARTDiagnosis_Grp IS NULL')
            .andWhere('TXCurr = 1');

        if (query.county) {
            missingDiagnosisDateByFacility.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            missingDiagnosisDateByFacility.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            missingDiagnosisDateByFacility.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            missingDiagnosisDateByFacility.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        // if (query.agency) {
        //     missingDiagnosisDateByFacility.andWhere('agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     missingDiagnosisDateByFacility.andWhere('project IN (:...project)', { project: query.project });
        // }

        if (query.gender) {
            missingDiagnosisDateByFacility.andWhere('Gender IN (:...gender)', { gender: query.gender });
        }

        // if (query.datimAgeGroup) {
        //     missingDiagnosisDateByFacility.andWhere('DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        // }

        if (query.populationType) {
            missingDiagnosisDateByFacility.andWhere('PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            missingDiagnosisDateByFacility.andWhere('LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await missingDiagnosisDateByFacility
            .groupBy('FacilityName, MFLCode, County, SubCounty, CTPartner')
            .orderBy('FacilityName')
            .getRawMany();
    }
}
