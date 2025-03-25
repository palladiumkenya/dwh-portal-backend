import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOverallUptakeAndSuppressionByFacilityQuery } from '../impl/get-vl-overall-uptake-and-suppression-by-facility.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlOverallUptakeAndSuppressionByFacilityQuery)
export class GetVlOverallUptakeAndSuppressionByFacilityHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionByFacilityQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionByFacilityQuery): Promise<any> {
        const vlOverallUptakeAndSuppression = this.repository
            .createQueryBuilder('f')
            .select([
                'f.FacilityName facility, f.County county, f.SubCounty subCounty, f.PartnerName partner, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(HasValidVL) vlDone, SUM(VirallySuppressed) suppressed',
            ])
            .where('f.MFLCode > 0')
            .andWhere('f.FacilityName IS NOT NULL');

        if (query.county) {
            vlOverallUptakeAndSuppression.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOverallUptakeAndSuppression.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOverallUptakeAndSuppression.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOverallUptakeAndSuppression.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOverallUptakeAndSuppression.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeAndSuppression.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlOverallUptakeAndSuppression.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlOverallUptakeAndSuppression
            .groupBy('f.FacilityName, f.SubCounty, f.County, f.PartnerName')
            .orderBy('f.FacilityName')
            .getRawMany();
    }
}
