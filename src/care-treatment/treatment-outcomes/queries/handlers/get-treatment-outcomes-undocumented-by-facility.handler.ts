import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { GetTreatmentOutcomesUndocumentedByFacilityQuery } from '../impl/get-treatment-outcomes-undocumented-by-facility.query';

@QueryHandler(GetTreatmentOutcomesUndocumentedByFacilityQuery)
export class GetTreatmentOutcomesUndocumentedByFacilityHandler implements IQueryHandler<GetTreatmentOutcomesUndocumentedByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {
    }

    async execute(query: GetTreatmentOutcomesUndocumentedByFacilityQuery): Promise<any> {
        const treatmentOutcomesUndocumentedByFacility = this.repository.createQueryBuilder('f')
            .select(['MFLCode mfl, FacilityName facility, County county, SubCounty subCounty, CTPartner partner, SUM(TotalOutcomes) patients'])
            .where('MFLCode > 0')
            .andWhere('FacilityName IS NOT NULL')
            .andWhere("ARTOutcome = 'LTFU'");

        if (query.county) {
            treatmentOutcomesUndocumentedByFacility.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            treatmentOutcomesUndocumentedByFacility.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            treatmentOutcomesUndocumentedByFacility.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            treatmentOutcomesUndocumentedByFacility.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        // if (query.agency) {
        //     treatmentOutcomesUndocumentedByFacility.andWhere('agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     treatmentOutcomesUndocumentedByFacility.andWhere('project IN (:...project)', { project: query.project });
        // }

        if (query.gender) {
            treatmentOutcomesUndocumentedByFacility.andWhere('Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            treatmentOutcomesUndocumentedByFacility.andWhere('DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        // if (query.populationType) {
        //     treatmentOutcomesUndocumentedByFacility.andWhere('PopulationType IN (:...populationType)', { populationType: query.populationType });
        // }

        // if (query.latestPregnancy) {
        //     treatmentOutcomesUndocumentedByFacility.andWhere('LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        // }

        return await treatmentOutcomesUndocumentedByFacility
            .groupBy('FacilityName, MFLCode, County, SubCounty, CTPartner')
            .orderBy('FacilityName')
            .getRawMany();
    }
}
