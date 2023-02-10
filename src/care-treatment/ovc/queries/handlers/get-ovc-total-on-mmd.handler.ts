import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcTotalOnMmdQuery } from '../impl/get-ovc-total-on-mmd.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcTotalOnMmdQuery)
export class GetOvcTotalOnMmdHandler implements IQueryHandler<GetOvcTotalOnMmdQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcTotalOnMmdQuery): Promise<any> {
        const ovcTotalOnMmd = this.repository.createQueryBuilder('f')
            .select(['Count (*) ovcTotalOnMmd'])
            .andWhere('f.onMMD=1 and f.OVCEnrollmentDate IS NOT NULL and f.TXCurr=1');

        if (query.county) {
            ovcTotalOnMmd.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcTotalOnMmd.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcTotalOnMmd.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcTotalOnMmd.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            ovcTotalOnMmd.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            ovcTotalOnMmd.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            ovcTotalOnMmd.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await ovcTotalOnMmd.getRawOne();
    }
}
