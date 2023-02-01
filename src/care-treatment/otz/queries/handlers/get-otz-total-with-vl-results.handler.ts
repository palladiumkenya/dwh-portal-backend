import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzTotalWithVlResultsQuery } from '../impl/get-otz-total-with-vl-results.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzTotalWithVlResultsQuery)
export class GetOtzTotalWithVlResultsHandler implements IQueryHandler<GetOtzTotalWithVlResultsQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetOtzTotalWithVlResultsQuery): Promise<any> {
        const totalWithVlResults = this.repository.createQueryBuilder('f')
            .select(['count(*) totalWithVlResults'])
            .where('f.lastVL IS NOT NULL');

        if (query.county) {
            totalWithVlResults.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            totalWithVlResults.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            totalWithVlResults.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            totalWithVlResults.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            totalWithVlResults.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            totalWithVlResults.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            totalWithVlResults.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await totalWithVlResults.getRawOne();
    }
}
