import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-stability-status.model';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByPartnerQuery } from '../get-dsd-stability-status-by-partner.query';

@QueryHandler(GetDsdStabilityStatusByPartnerQuery)
export class GetDsdStabilityStatusByPartnerHandler implements IQueryHandler<GetDsdStabilityStatusByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransDsdStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByPartnerQuery): Promise<any> {
        const dsdStabilityStatusByPartner = this.repository.createQueryBuilder('f')
            .select(['f.CTPartner partner, SUM([Stability]) stable'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdStabilityStatusByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdStabilityStatusByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdStabilityStatusByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdStabilityStatusByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdStabilityStatusByPartner
            .groupBy('[CTPartner]')
            .orderBy('SUM([Stability])', 'ASC')
            .getRawMany();
    }
}
