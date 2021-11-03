import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByPartnerQuery } from '../impl/get-dsd-stability-status-by-partner.query';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';

@QueryHandler(GetDsdStabilityStatusByPartnerQuery)
export class GetDsdStabilityStatusByPartnerHandler implements IQueryHandler<GetDsdStabilityStatusByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdUptake, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdUptake>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByPartnerQuery): Promise<any> {
        const dsdStabilityStatusByPartner = this.repository.createQueryBuilder('f')
            .select(['SUM(MMD) mmd, SUM(NonMMD) nonMmd, [CTPartner] partner, CASE WHEN (SUM(NonMMD) = 0 and SUM(MMD) > 0) THEN 100 WHEN (SUM(NonMMD) = 0 and SUM(MMD) = 0) THEN 0 ELSE (CAST(SUM(MMD) as float)/CAST(SUM(NonMMD) as float)) END percentMMD'])
            .where('f.MFLCode > 1');

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

        if (query.agency) {
            dsdStabilityStatusByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await dsdStabilityStatusByPartner
            .groupBy('CTPartner')
            .orderBy('percentMMD', 'DESC')
            .getRawMany();
    }
}
