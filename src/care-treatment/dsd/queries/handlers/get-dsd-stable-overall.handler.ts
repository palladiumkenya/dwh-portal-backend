import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDsdStableOverallQuery } from '../impl/get-dsd-stable-overall.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateDSD } from './../../entities/AggregateDSD.model';

@QueryHandler(GetDsdStableOverallQuery)
export class GetDsdStableOverallHandler implements IQueryHandler<GetDsdStableOverallQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {
    }

    async execute(query: GetDsdStableOverallQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['SUM([Stability]) Stable, SUM([TXCurr])TXCurr, AgeGroup ageGroup'])
            .where('f.MFLCode > 1')
            .andWhere('f.StabilityAssessment = :stability', { stability: "Stable"});

        if (query.county) {
            dsdMmdStable.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdMmdStable.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdMmdStable.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdMmdStable.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdMmdStable.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdMmdStable.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdMmdStable.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await dsdMmdStable
            .groupBy('AgeGroup')
            .orderBy('AgeGroup', 'ASC')
            .getRawMany();
    }
}
