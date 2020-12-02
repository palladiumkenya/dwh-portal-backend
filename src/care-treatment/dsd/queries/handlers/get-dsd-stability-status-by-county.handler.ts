import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdStabilityStatus } from '../../entities/fact-trans-dsd-stability-status.model';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByCountyQuery } from '../impl/get-dsd-stability-status-by-county.query';

@QueryHandler(GetDsdStabilityStatusByCountyQuery)
export class GetDsdStabilityStatusByCountyHandler implements IQueryHandler<GetDsdStabilityStatusByCountyQuery> {
    constructor(
        @InjectRepository(FactTransDsdStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByCountyQuery): Promise<any> {
        const dsdStabilityStatusByCounty = this.repository.createQueryBuilder('f')
            .select(['f.County county, SUM(TxCurr) txCurr, SUM(MMD) mmd, SUM(NonMMD) nonMmd, SUM(Stable) stable, SUM(UnStable) unStable'])
            .where('f.MFLCode > 1');

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
            .groupBy('County')
            .orderBy('SUM(Stable)', 'DESC')
            .getRawMany();
    }
}
