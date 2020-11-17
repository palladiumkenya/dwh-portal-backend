import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionByFacilityQuery } from '../impl/get-vl-overall-uptake-and-suppression-by-facility.query';

@QueryHandler(GetVlOverallUptakeAndSuppressionByFacilityQuery)
export class GetVlOverallUptakeAndSuppressionByFacilityHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionByFacilityQuery): Promise<any> {
        const vlOverallUptakeAndSuppression = this.repository.createQueryBuilder('f')
            .select(['f.FacilityName facility, f.County county, f.SubCounty subCounty, f.CTPartner partner, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(VLDone) vlDone, SUM(VirallySuppressed) suppressed'])
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
            vlOverallUptakeAndSuppression.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlOverallUptakeAndSuppression
            .groupBy('f.FacilityName, f.SubCounty, f.County, f.CTPartner')
            .orderBy('f.FacilityName')
            .getRawMany();
    }
}
