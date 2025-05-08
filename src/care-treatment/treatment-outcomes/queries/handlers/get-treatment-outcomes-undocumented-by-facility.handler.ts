import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesUndocumentedByFacilityQuery } from '../impl/get-treatment-outcomes-undocumented-by-facility.query';
import { AggregateTreatmentOutcomes } from '../../entities/aggregate-treatment-outcomes.model';

@QueryHandler(GetTreatmentOutcomesUndocumentedByFacilityQuery)
export class GetTreatmentOutcomesUndocumentedByFacilityHandler implements IQueryHandler<GetTreatmentOutcomesUndocumentedByFacilityQuery> {
    constructor(
        @InjectRepository(AggregateTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<AggregateTreatmentOutcomes>
    ) {
    }

    async execute(query: GetTreatmentOutcomesUndocumentedByFacilityQuery): Promise<any> {
        const treatmentOutcomesUndocumentedByFacility = this.repository
            .createQueryBuilder('f')
            .select([
                'MFLCode mfl, FacilityName facility, County county, SubCounty subCounty, PartnerName partner, SUM(TotalOutcomes) patients',
            ])
            .where('MFLCode > 0')
            .andWhere('StartYear IS NOT NULL')
            .andWhere("ARTOutcomeDescription = 'Undocumented Loss'");

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
            treatmentOutcomesUndocumentedByFacility.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            treatmentOutcomesUndocumentedByFacility.andWhere('AgencyName IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     treatmentOutcomesUndocumentedByFacility.andWhere('project IN (:...project)', { project: query.project });
        // }

        if (query.gender) {
            treatmentOutcomesUndocumentedByFacility.andWhere('Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            treatmentOutcomesUndocumentedByFacility.andWhere('DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            treatmentOutcomesUndocumentedByFacility.andWhere('PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            treatmentOutcomesUndocumentedByFacility.andWhere('LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await treatmentOutcomesUndocumentedByFacility
            .groupBy('FacilityName, MFLCode, County, SubCounty, PartnerName')
            .orderBy('FacilityName')
            .getRawMany();
    }
}
