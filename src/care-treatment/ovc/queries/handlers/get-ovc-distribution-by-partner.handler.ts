import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionByPartnerQuery } from '../impl/get-ovc-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcDistributionByPartnerQuery)
export class GetOvcDistributionByPartnerHandler implements IQueryHandler<GetOvcDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcDistributionByPartnerQuery): Promise<any> {
        const overOvcServByPartner = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) count, [PartnerName] partner, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            overOvcServByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overOvcServByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overOvcServByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overOvcServByPartner.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServByPartner.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overOvcServByPartner.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overOvcServByPartner.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overOvcServByPartner
            .groupBy('PartnerName')
            .getRawMany();
    }
}
