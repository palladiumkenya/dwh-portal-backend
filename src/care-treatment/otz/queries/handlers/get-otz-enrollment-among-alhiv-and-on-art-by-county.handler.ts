import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByCountyHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery) {
        const otzEnrollmentsCounty = this.repository
            .createQueryBuilder('f')
            .select([
                '[County], SUM(CompletedTraining) count_training, SUM(Enrolled) TXCurr, SUM(Enrolled) * 100.0 / SUM(SUM(Enrolled)) OVER () AS Percentage',
            ]);

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
            otzEnrollmentsCounty.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsCounty
            .groupBy('County')
            .getRawMany();
    }
}
