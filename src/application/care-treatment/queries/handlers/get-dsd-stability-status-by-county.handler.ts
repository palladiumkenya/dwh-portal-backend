import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-stability-status.model';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByCountyQuery } from '../get-dsd-stability-status-by-county.query';

@QueryHandler(GetDsdStabilityStatusByCountyQuery)
export class GetDsdStabilityStatusByCountyHandler implements IQueryHandler<GetDsdStabilityStatusByCountyQuery> {
    constructor(
        @InjectRepository(FactTransDsdStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByCountyQuery): Promise<any> {
        const dsdStabilityStatusByCounty = this.repository.createQueryBuilder('f')
            .select(['f.County county, SUM([Stability]) stable'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdStabilityStatusByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdStabilityStatusByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdStabilityStatusByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdStabilityStatusByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdStabilityStatusByCounty
            .groupBy('[County]')
            .orderBy('SUM([Stability])', 'ASC')
            .getRawMany();
    }
}