import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByCountyQuery } from '../impl/get-art-optimization-current-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from './../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetArtOptimizationCurrentByCountyQuery)
export class GetArtOptimizationCurrentByCountyHandler
    implements IQueryHandler<GetArtOptimizationCurrentByCountyQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<
            AggregateOptimizeCurrentRegimens
        >,
    ) {}

    async execute(query: GetArtOptimizationCurrentByCountyQuery): Promise<any> {
        const artOptimizationCurrentByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                'County county, CurrentRegimen regimen, Gender gender, Agegroup, sum(TXCurr) txCurr',
            ])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByCounty.andWhere(
                'f.County IN (:...county)',
                { county: query.county },
            );
        }

        if (query.subCounty) {
            artOptimizationCurrentByCounty.andWhere(
                'f.Subcounty IN (:...subCounty)',
                { subCounty: query.subCounty },
            );
        }

        if (query.facility) {
            artOptimizationCurrentByCounty.andWhere(
                'f.FacilityName IN (:...facility)',
                { facility: query.facility },
            );
        }

        if (query.partner) {
            artOptimizationCurrentByCounty.andWhere(
                'f.PartnerName IN (:...partner)',
                { partner: query.partner },
            );
        }

        if (query.agency) {
            artOptimizationCurrentByCounty.andWhere(
                'f.AgencyName IN (:...agency)',
                { agency: query.agency },
            );
        }

        // if (query.project) {
        //     artOptimizationCurrentByCounty.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationCurrentByCounty.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationCurrentByCounty.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        if (query.gender) {
            artOptimizationCurrentByCounty.andWhere(
                'f.Gender IN (:...gender)',
                { gender: query.gender },
            );
        }

        if (query.datimAgeGroup) {
            artOptimizationCurrentByCounty.andWhere(
                'f.DATIMAgeGroup IN (:...datimAgeGroup)',
                { datimAgeGroup: query.datimAgeGroup },
            );
        }

        if (query.latestPregnancy) {
            artOptimizationCurrentByCounty.andWhere(
                'f.LatestPregnancy IN (:...latestPregnancy)',
                { latestPregnancy: query.latestPregnancy },
            );
        }

        return await artOptimizationCurrentByCounty
            .groupBy('County, CurrentRegimen, Gender, Agegroup')
            .orderBy('County, CurrentRegimen, Gender, Agegroup')
            .getRawMany();
    }
}
