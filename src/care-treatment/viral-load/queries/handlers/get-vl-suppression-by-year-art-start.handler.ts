import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { GetVlSuppressionByYearArtStartQuery } from '../impl/get-vl-suppression-by-year-art-start.query';
import { AggregateVLUptakeOutcome } from './../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlSuppressionByYearArtStartQuery)
export class GetVlSuppressionByYearArtStartHandler implements IQueryHandler<GetVlSuppressionByYearArtStartQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlSuppressionByYearArtStartQuery): Promise<any> {
        const vlSuppressionByYearArtStart = this.repository.createQueryBuilder('f')
            .select(['f.StartARTYear year, SUM(f.TotalLast12MVL) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.Last12MVLResult = :suppression', { suppression: "SUPPRESSED" })
            .andWhere('f.StartARTYear >= :year', { year: 2011 });

        if (query.county) {
            vlSuppressionByYearArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByYearArtStart.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByYearArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByYearArtStart.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByYearArtStart.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByYearArtStart.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByYearArtStart.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByYearArtStart
            .groupBy('f.StartARTYear')
            .orderBy('f.StartARTYear')
            .getRawMany();
    }
}
