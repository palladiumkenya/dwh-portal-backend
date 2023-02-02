import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByPartnerQuery } from '../impl/get-dsd-stability-status-by-partner.query';
import { AggregateDSD } from './../../entities/AggregateDSD.model';

@QueryHandler(GetDsdStabilityStatusByPartnerQuery)
export class GetDsdStabilityStatusByPartnerHandler implements IQueryHandler<GetDsdStabilityStatusByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByPartnerQuery): Promise<any> {
        const dsdStabilityStatusByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                'SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd, [CTPartner] partner, CASE WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) > 0) THEN 100 WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) = 0) THEN 0 ELSE (CAST(SUM(patients_onMMD) as float)/CAST(SUM(patients_nonMMD) as float)) END percentMMD',
            ])
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

        if (query.datimAgeGroup) {
            dsdStabilityStatusByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdStabilityStatusByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdStabilityStatusByPartner
            .groupBy('CTPartner')
            .orderBy('percentMMD', 'DESC')
            .getRawMany();
    }
}
