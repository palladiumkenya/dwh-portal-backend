import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-stability-status.model';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusQuery } from '../get-dsd-stability-status.query';

@QueryHandler(GetDsdStabilityStatusQuery)
export class GetDsdStabilityStatusHandler implements IQueryHandler<GetDsdStabilityStatusQuery> {
    constructor(
        @InjectRepository(FactTransDsdStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusQuery): Promise<any> {
        const dsdCascade = this.repository.createQueryBuilder('f')
            .select(['SUM([Stability]) stable'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdCascade.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdCascade.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdCascade.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdCascade.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdCascade.getRawOne();
    }
}
