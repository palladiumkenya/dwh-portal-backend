import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOutcomesHvlByFacilityQuery } from '../impl/get-vl-outcomes-hvl-by-facility.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlOutcomesHvlByFacilityQuery)
export class GetVlOutcomesHvlByFacilityHandler implements IQueryHandler<GetVlOutcomesHvlByFacilityQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesHvlByFacilityQuery): Promise<any> {
        const vlOutcomeHvlByFacility = this.repository
            .createQueryBuilder('f')
            .select([
                'MFLCode mfl, FacilityName facility, County county, SubCounty subCounty, PartnerName partner, SUM(TotalValidVLResultCategory) patients',
            ])
            .where('MFLCode > 0')
            .andWhere('FacilityName IS NOT NULL')
            .andWhere("ValidVLResultCategory = 'UNSUPPRESSED'");

        if (query.county) {
            vlOutcomeHvlByFacility.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOutcomeHvlByFacility.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOutcomeHvlByFacility.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOutcomeHvlByFacility.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOutcomeHvlByFacility.andWhere('AgencyName IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     vlOutcomeHvlByFacility.andWhere('project IN (:...project)', { project: query.project });
        // }

        if (query.gender) {
            vlOutcomeHvlByFacility.andWhere('Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            vlOutcomeHvlByFacility.andWhere('AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        // if (query.populationType) {
        //     vlOutcomeHvlByFacility.andWhere('PopulationType IN (:...populationType)', { populationType: query.populationType });
        // }

        // if (query.latestPregnancy) {
        //     vlOutcomeHvlByFacility.andWhere('LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        // }

        return await vlOutcomeHvlByFacility
            .groupBy('FacilityName, MFLCode, County, SubCounty, PartnerName')
            .orderBy('FacilityName')
            .getRawMany();
    }
}
