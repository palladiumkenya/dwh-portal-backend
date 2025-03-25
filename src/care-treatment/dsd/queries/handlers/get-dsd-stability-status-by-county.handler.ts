import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByCountyQuery } from '../impl/get-dsd-stability-status-by-county.query';
import { AggregateDSD } from './../../entities/AggregateDSD.model';

@QueryHandler(GetDsdStabilityStatusByCountyQuery)
export class GetDsdStabilityStatusByCountyHandler implements IQueryHandler<GetDsdStabilityStatusByCountyQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByCountyQuery): Promise<any> {
        let dsdStabilityStatusByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                'SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd, [County] county, CASE WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) > 0) THEN 100 WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) = 0) THEN 0 ELSE (CAST(SUM(patients_onMMD) as float)/CAST(SUM(patients_nonMMD) as float)) END percentMMD',
            ])
            .where('f.MFLCode > 1');

        if (query.county) {
            dsdStabilityStatusByCounty = this.repository
                .createQueryBuilder('f')
                .select([
                    'SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd, [SubCounty] county, CASE WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) > 0) THEN 100 WHEN (SUM(patients_nonMMD) = 0 and SUM(patients_onMMD) = 0) THEN 0 ELSE (CAST(SUM(patients_onMMD) as float)/CAST(SUM(patients_nonMMD) as float)) END percentMMD',
                ])
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
            dsdStabilityStatusByCounty.andWhere('f.PartnerName IN (:partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdStabilityStatusByCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdStabilityStatusByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdStabilityStatusByCounty.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
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
