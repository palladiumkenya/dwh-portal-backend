import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusQuery } from '../impl/get-dsd-stability-status.query';
import { AggregateDSD } from './../../entities/AggregateDSD.model';

@QueryHandler(GetDsdStabilityStatusQuery)
export class GetDsdStabilityStatusHandler implements IQueryHandler<GetDsdStabilityStatusQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdStabilityStatusQuery): Promise<any> {
        const dsdStabilityStatus = this.repository
            .createQueryBuilder('f')
            //TODO:: Add stable and unstable columns
            .select([
                'SUM(TxCurr) txCurr, SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd, SUM(Stable) stable, SUM(UnStable) unStable',
            ])
            .where('f.MFLCode > 1');

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
            dsdStabilityStatus.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdStabilityStatus.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdStabilityStatus.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdStabilityStatus.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdStabilityStatus.getRawOne();
    }
}
