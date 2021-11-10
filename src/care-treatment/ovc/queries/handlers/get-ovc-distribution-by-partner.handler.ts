import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionByPartnerQuery } from '../impl/get-ovc-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcDistributionByPartnerQuery)
export class GetOvcDistributionByPartnerHandler implements IQueryHandler<GetOvcDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcDistributionByPartnerQuery): Promise<any> {
        const overOvcServByPartner = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) count, [CTPartner] partner, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

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
            overOvcServByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await overOvcServByPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
