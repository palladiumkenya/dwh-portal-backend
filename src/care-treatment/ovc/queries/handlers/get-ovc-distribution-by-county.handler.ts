import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionByCountyQuery } from '../impl/get-ovc-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcDistributionByCountyQuery)
export class GetOvcDistributionByCountyHandler implements IQueryHandler<GetOvcDistributionByCountyQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcDistributionByCountyQuery): Promise<any> {
        const overOvcServByCounty = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) count, [County], COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            overOvcServByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overOvcServByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overOvcServByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overOvcServByCounty.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServByCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overOvcServByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overOvcServByCounty.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overOvcServByCounty
            .groupBy('County')
            .getRawMany();
    }
}
