import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdStabilityStatus } from '../../entities/fact-trans-dsd-stability-status.model';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusQuery } from '../impl/get-dsd-stability-status.query';

@QueryHandler(GetDsdStabilityStatusQuery)
export class GetDsdStabilityStatusHandler implements IQueryHandler<GetDsdStabilityStatusQuery> {
    constructor(
        @InjectRepository(FactTransDsdStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusQuery): Promise<any> {
        const dsdStabilityStatus = this.repository.createQueryBuilder('f')
            .select(['SUM([Stability]) stable'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdStabilityStatus.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdStabilityStatus.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdStabilityStatus.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdStabilityStatus.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdStabilityStatus.getRawOne();
    }
}
