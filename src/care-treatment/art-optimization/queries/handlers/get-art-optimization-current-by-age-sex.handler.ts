import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByAgeSexQuery } from '../impl/get-art-optimization-current-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from '../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetArtOptimizationCurrentByAgeSexQuery)
export class GetArtOptimizationCurrentByAgeSexHandler implements IQueryHandler<GetArtOptimizationCurrentByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeCurrentRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationCurrentByAgeSexQuery): Promise<any> {
        const artOptimizationCurrentByAgeSex = this.repository.createQueryBuilder('f')
        //TODO:: Add Current Regimen
            .select(['CurrentRegimen regimen, Sex gender, DATIMAgeGroup datimAgeGroup, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByAgeSex.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationCurrentByAgeSex.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationCurrentByAgeSex.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationCurrentByAgeSex.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationCurrentByAgeSex.andWhere('f.AgencyName IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        if (query.gender) {
            artOptimizationCurrentByAgeSex.andWhere('f.Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationCurrentByAgeSex.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.latestPregnancy) {
            artOptimizationCurrentByAgeSex.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationCurrentByAgeSex
            .groupBy('CurrentRegimen, Sex, DATIMAgeGroup')
            .orderBy('CurrentRegimen, Sex, DATIMAgeGroup')
            .getRawMany();
    }
}
