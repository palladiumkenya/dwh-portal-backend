import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlUptakeByPartnerQuery } from '../impl/get-vl-uptake-by-partner.query';

@QueryHandler(GetVlUptakeByPartnerQuery)
export class GetVlUptakeByPartnerHandler implements IQueryHandler<GetVlUptakeByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlUptakeByPartnerQuery): Promise<any> {
        const vlUptakeByPartner = this.repository.createQueryBuilder('f')
            .select(['f.CTPartner partner, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(VLDone) vlDone, SUM(VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.CTPartner IS NOT NULL');

        if (query.county) {
            vlUptakeByPartner.andWhere('f.CTPartner IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeByPartner
            .groupBy('f.CTPartner')
            .orderBy('SUM(f.VLDone)', 'DESC')
            .getRawMany();
    }
}
