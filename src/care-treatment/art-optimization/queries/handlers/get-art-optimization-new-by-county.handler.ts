import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationNewByCountyQuery } from '../impl/get-art-optimization-new-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeStartRegimens } from '../../entities/aggregate-optimize-start-regimens.model';

@QueryHandler(GetArtOptimizationNewByCountyQuery)
export class GetArtOptimizationNewByCountyHandler implements IQueryHandler<GetArtOptimizationNewByCountyQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeStartRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeStartRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationNewByCountyQuery): Promise<any> {
        const artOptimizationNewByCounty = this.repository.createQueryBuilder('f')
            .select(['County county, StartRegimen startRegimen, StartARTYr year, StartARTMonth month, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationNewByCounty.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationNewByCounty.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationNewByCounty.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationNewByCounty.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationNewByCounty.andWhere('f.AgencyName IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     artOptimizationNewByCounty.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        if(query.month) {
            artOptimizationNewByCounty.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        }

        if (query.year) {
            artOptimizationNewByCounty.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        }

        if (query.gender) {
            artOptimizationNewByCounty.andWhere('f.Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationNewByCounty.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.latestPregnancy) {
            artOptimizationNewByCounty.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationNewByCounty
            .groupBy('County, StartRegimen, StartARTYr, StartARTMonth')
            .orderBy('County, StartRegimen, StartARTYr, StartARTMonth')
            .getRawMany();
    }
}
