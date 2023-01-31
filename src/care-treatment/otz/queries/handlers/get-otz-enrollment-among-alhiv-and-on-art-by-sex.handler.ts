import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtBySexHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery): Promise<any> {
        const otzEnrollmentsBySex = this.repository.createQueryBuilder('f')
            .select(['[Gender], SUM(Enrolled) TXCurr, SUM(Enrolled) * 100.0 / SUM(SUM(Enrolled)) OVER () AS Percentage'])

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

        if (query.datimAgeGroup) {
            otzEnrollmentsBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsBySex
            .groupBy('Gender')
            .getRawMany();
    }
}
