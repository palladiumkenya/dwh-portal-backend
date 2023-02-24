import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationNewByPartnerQuery } from '../impl/get-art-optimization-new-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeStartRegimens } from './../../entities/aggregate-optimize-start-regimens.model';

@QueryHandler(GetArtOptimizationNewByPartnerQuery)
export class GetArtOptimizationNewByPartnerHandler implements IQueryHandler<GetArtOptimizationNewByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeStartRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeStartRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationNewByPartnerQuery): Promise<any> {
        const artOptimizationNewByPartner = this.repository.createQueryBuilder('f')
            .select(['PartnerName partner, StartRegimen startRegimen, StartARTYr year, StartARTMonth month, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationNewByPartner.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationNewByPartner.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationNewByPartner.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationNewByPartner.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationNewByPartner.andWhere('f.AgencyName IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     artOptimizationNewByPartner.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        if(query.month) {
            artOptimizationNewByPartner.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        }

        if (query.year) {
            artOptimizationNewByPartner.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        }

        if (query.gender) {
            artOptimizationNewByPartner.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationNewByPartner.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.latestPregnancy) {
            artOptimizationNewByPartner.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationNewByPartner
            .groupBy('PartnerName, StartRegimen, StartARTYr, StartARTMonth')
            .orderBy('PartnerName, StartRegimen, StartARTYr, StartARTMonth')
            .getRawMany();
    }
}
