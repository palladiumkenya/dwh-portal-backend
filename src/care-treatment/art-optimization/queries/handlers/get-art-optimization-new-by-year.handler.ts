import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationNewByYearQuery } from '../impl/get-art-optimization-new-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeStartRegimen } from '../../entities/fact-trans-optimize-start-regimen.model';
import { Repository } from 'typeorm';
import { AggregateOptimizeStartRegimens } from './../../entities/aggregate-optimize-start-regimens.model';

@QueryHandler(GetArtOptimizationNewByYearQuery)
export class GetArtOptimizationNewByYearHandler implements IQueryHandler<GetArtOptimizationNewByYearQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeStartRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeStartRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationNewByYearQuery): Promise<any> {
        const artOptimizationNewByYear = this.repository.createQueryBuilder('f')
            .select(['StartARTYr year, StartARTMonth month, StartRegimen startRegimen, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationNewByYear.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationNewByYear.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationNewByYear.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationNewByYear.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationNewByYear.andWhere('f.CTAgency IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     artOptimizationNewByYear.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        if(query.month) {
            artOptimizationNewByYear.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        }

        if (query.year) {
            artOptimizationNewByYear.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        }

        if (query.gender) {
            artOptimizationNewByYear.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationNewByYear.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.latestPregnancy) {
            artOptimizationNewByYear.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationNewByYear
            .groupBy('StartARTYr, StartARTMonth, StartRegimen')
            .orderBy('StartARTYr, StartARTMonth, StartRegimen')
            .getRawMany();
    }
}
