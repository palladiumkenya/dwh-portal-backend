import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtBySexHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery): Promise<any> {
        const otzEnrollmentsBySex = this.repository.createQueryBuilder('f')
            .select(['[Gender], SUM([TXCurr]) TXCurr, SUM(f.[TXCurr]) * 100.0 / SUM(SUM(f.[TXCurr])) OVER () AS Percentage'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            otzEnrollmentsBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsBySex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await otzEnrollmentsBySex
            .groupBy('Gender')
            .getRawMany();
    }
}
