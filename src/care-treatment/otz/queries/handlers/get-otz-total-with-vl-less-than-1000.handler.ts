import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzTotalWithVlLessThan1000Query } from '../impl/get-otz-total-with-vl-less-than-1000.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzTotalWithVlLessThan1000Query)
export class GetOtzTotalWithVlLessThan1000Handler implements IQueryHandler<GetOtzTotalWithVlLessThan1000Query> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzTotalWithVlLessThan1000Query): Promise<any> {
        const totalWithVLLessThan1000 = this.repository.createQueryBuilder('f')
            .select(['count(*) totalWithVlLessThan1000'])
            .where('f.lastVL IS NOT NULL')
            .andWhere('f.OTZEnrollmentDate IS NOT NULL')
            .andWhere('CASE WHEN ISNUMERIC(f.lastVL) = 0 THEN 1 ELSE CAST(CONVERT(numeric, f.lastVL) as int) END < 1000');

        if (query.county) {
            totalWithVLLessThan1000.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            totalWithVLLessThan1000.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            totalWithVLLessThan1000.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            totalWithVLLessThan1000.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await totalWithVLLessThan1000.getRawOne();
    }
}