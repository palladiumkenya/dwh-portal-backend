import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByCountyQuery } from '../impl/get-dsd-stability-status-by-county.query';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';

@QueryHandler(GetDsdStabilityStatusByCountyQuery)
export class GetDsdStabilityStatusByCountyHandler implements IQueryHandler<GetDsdStabilityStatusByCountyQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdUptake, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdUptake>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByCountyQuery): Promise<any> {
        let dsdStabilityStatusByCounty = this.repository.createQueryBuilder('f')
            .select(['SUM(MMD) mmd, SUM(NonMMD) nonMmd, [County] county, CASE WHEN (SUM(NonMMD) = 0 and SUM(MMD) > 0) THEN 100 WHEN (SUM(NonMMD) = 0 and SUM(MMD) = 0) THEN 0 ELSE (CAST(SUM(MMD) as float)/CAST(SUM(NonMMD) as float)) END percentMMD'])
            .where('f.MFLCode > 1');

        if (query.county) {
            dsdStabilityStatusByCounty = this.repository.createQueryBuilder('f')
                .select(['SUM(MMD) mmd, SUM(NonMMD) nonMmd, [SubCounty] county, CASE WHEN (SUM(NonMMD) = 0 and SUM(MMD) > 0) THEN 100 WHEN (SUM(NonMMD) = 0 and SUM(MMD) = 0) THEN 0 ELSE (CAST(SUM(MMD) as float)/CAST(SUM(NonMMD) as float)) END percentMMD'])
                .where('f.MFLCode > 1');
            dsdStabilityStatusByCounty.andWhere('f.County IN (:counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdStabilityStatusByCounty.andWhere('f.SubCounty IN (:subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdStabilityStatusByCounty.andWhere('f.FacilityName IN (:facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdStabilityStatusByCounty.andWhere('f.CTPartner IN (:partners)', { partners: query.partner });
        }

        if (query.county) {
            return await dsdStabilityStatusByCounty
                .groupBy('SubCounty')
                .orderBy('percentMMD', 'DESC')
                .getRawMany();
        } else {
            return await dsdStabilityStatusByCounty
                .groupBy('County')
                .orderBy('percentMMD', 'DESC')
                .getRawMany();
        }
    }
}
