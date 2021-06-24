import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByPartnerHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery) {
        const otzEnrollmentsPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner] partner, COUNT(OTZ_Traning) count_training, SUM([TXCurr]) TXCurr, SUM(f.[TXCurr]) * 100.0 / SUM(SUM(f.[TXCurr])) OVER () AS Percentage'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            otzEnrollmentsPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await otzEnrollmentsPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
