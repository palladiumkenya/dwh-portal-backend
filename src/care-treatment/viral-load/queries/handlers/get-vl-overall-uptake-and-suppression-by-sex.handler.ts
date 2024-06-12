import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOverallUptakeAndSuppressionBySexQuery } from '../impl/get-vl-overall-uptake-and-suppression-by-sex.query';
import { AggregateVLUptakeOutcome } from './../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlOverallUptakeAndSuppressionBySexQuery)
export class GetVlOverallUptakeAndSuppressionBySexHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionBySexQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionBySexQuery): Promise<any> {
        const vlOverallUptakeAndSuppressionBySex = this.repository
            .createQueryBuilder('f')
            .select([
                'Gender gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(HasValidVL) vlDone, SUM(VirallySuppressed) suppressed',
            ])
            // .where('f.MFLCode > 0')
            .where('f.TXCurr > 0')
            .andWhere('f.Gender IS NOT NULL');

        if (query.county) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlOverallUptakeAndSuppressionBySex
            .groupBy('f.Gender')
            .getRawMany();
    }
}
