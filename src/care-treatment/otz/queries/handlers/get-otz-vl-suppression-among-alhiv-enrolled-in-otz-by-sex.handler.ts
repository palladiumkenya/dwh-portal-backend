import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery): Promise<any> {
        const vlSuppressionOtzBySex = this.repository.createQueryBuilder('f')
            .select(['[Gender], Last12MVLResult, COUNT(Last12MVLResult) AS vlSuppression'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            vlSuppressionOtzBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlSuppressionOtzBySex
            .groupBy('[Gender], Last12MVLResult')
            .getRawMany();
    }
}
