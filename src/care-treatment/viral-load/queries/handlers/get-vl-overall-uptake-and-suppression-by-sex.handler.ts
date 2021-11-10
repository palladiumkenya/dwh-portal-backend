import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionBySexQuery } from '../impl/get-vl-overall-uptake-and-suppression-by-sex.query';

@QueryHandler(GetVlOverallUptakeAndSuppressionBySexQuery)
export class GetVlOverallUptakeAndSuppressionBySexHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionBySexQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionBySexQuery): Promise<any> {
        const vlOverallUptakeAndSuppressionBySex = this.repository.createQueryBuilder('f')
            .select(['Gender gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(VLDone) vlDone, SUM(VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
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
            vlOverallUptakeAndSuppressionBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await vlOverallUptakeAndSuppressionBySex
            .groupBy('f.Gender')
            .getRawMany();
    }
}
