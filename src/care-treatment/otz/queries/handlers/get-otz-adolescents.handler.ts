import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsQuery } from '../impl/get-otz-adolescents.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzAdolescentsQuery)
export class GetOtzAdolescentsHandler implements IQueryHandler<GetOtzAdolescentsQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzAdolescentsQuery): Promise<any> {
        const otzTotalAdolescents = this.repository.createQueryBuilder('f')
            .select(['count(*) totalAdolescents, Gender']);

        if (query.county) {
            otzTotalAdolescents.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzTotalAdolescents.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzTotalAdolescents.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzTotalAdolescents.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await otzTotalAdolescents
            .groupBy('Gender')
            .orderBy('Gender')
            .getRawMany();
    }
}
