import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionQuery } from '../impl/get-vl-overall-uptake-and-suppression.query';

@QueryHandler(GetVlOverallUptakeAndSuppressionQuery)
export class GetVlOverallUptakeAndSuppressionHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionQuery): Promise<any> {
        const vlOverallUptakeAndSuppression = this.repository.createQueryBuilder('f')
            .select(['Gender gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(VLDone) vlDone, SUM(VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.Gender IS NOT NULL');

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
            vlOverallUptakeAndSuppression.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlOverallUptakeAndSuppression
            .groupBy('f.Gender')
            .getRawMany();
    }
}
