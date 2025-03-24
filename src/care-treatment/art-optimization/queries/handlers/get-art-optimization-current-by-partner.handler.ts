import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByPartnerQuery } from '../impl/get-art-optimization-current-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from '../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetArtOptimizationCurrentByPartnerQuery)
export class GetArtOptimizationCurrentByPartnerHandler implements IQueryHandler<GetArtOptimizationCurrentByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeCurrentRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationCurrentByPartnerQuery): Promise<any> {
        const artOptimizationCurrentByPartner = this.repository.createQueryBuilder('f')
            .select(['PartnerName partner, CurrentRegimen regimen, Sex gender, Agegroup, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByPartner.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationCurrentByPartner.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationCurrentByPartner.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationCurrentByPartner.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationCurrentByPartner.andWhere('f.AgencyName IN (:...agency)', { agency: query.agency });
        }

        if (query.gender) {
            artOptimizationCurrentByPartner.andWhere('f.Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationCurrentByPartner.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.latestPregnancy) {
            artOptimizationCurrentByPartner.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationCurrentByPartner
            .groupBy('PartnerName, CurrentRegimen, Sex, Agegroup')
            .orderBy('PartnerName, CurrentRegimen, Sex, Agegroup')
            .getRawMany();
    }
}
