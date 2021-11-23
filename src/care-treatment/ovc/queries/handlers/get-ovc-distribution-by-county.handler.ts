import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionByCountyQuery } from '../impl/get-ovc-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcDistributionByCountyQuery)
export class GetOvcDistributionByCountyHandler implements IQueryHandler<GetOvcDistributionByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcDistributionByCountyQuery): Promise<any> {
        const overOvcServByCounty = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) count, [County], COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

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
            overOvcServByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await overOvcServByCounty
            .groupBy('County')
            .getRawMany();
    }
}
