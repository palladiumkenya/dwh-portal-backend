import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsEnrolledByCountyQuery } from '../impl/get-otz-adolescents-enrolled-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzAdolescentsEnrolledByCountyQuery)
export class GetOtzAdolescentsEnrolledByCountyHandler implements IQueryHandler<GetOtzAdolescentsEnrolledByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzAdolescentsEnrolledByCountyQuery): Promise<any> {
        const otzEnrollmentsCounty = this.repository.createQueryBuilder('f')
            .select(['[County], COUNT(*) totalAdolescents']);

        if (query.county) {
            otzEnrollmentsCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await otzEnrollmentsCounty
            .groupBy('County')
            .getRawMany();
    }
}
