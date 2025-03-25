import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzNotEnrolledByPartnerQuery } from '../impl/get-otz-not-enrolled-by-partner.query';
import { AggregateOtz } from '../../entities/aggregate-otz.model';

@QueryHandler(GetOtzNotEnrolledByPartnerQuery)
export class GetOtzNotEnrolledByPartnerHandler
    implements IQueryHandler<GetOtzNotEnrolledByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>,
    ) {}

    async execute(query: GetOtzNotEnrolledByPartnerQuery): Promise<any> {
        const proportionWhoCompletedTraining = this.repository
            .createQueryBuilder('f')
            .select(['SUM(Enrolled) Num, PartnerName CTPartner']);

        if (query.county) {
            proportionWhoCompletedTraining.andWhere(
                'f.County IN (:...counties)',
                { counties: query.county },
            );
        }

        if (query.subCounty) {
            proportionWhoCompletedTraining.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            proportionWhoCompletedTraining.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            proportionWhoCompletedTraining.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            proportionWhoCompletedTraining.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTraining.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            proportionWhoCompletedTraining.andWhere(
                'f.Sex IN (:...genders)',
                { genders: query.gender },
            );
        }

        return await proportionWhoCompletedTraining
            .groupBy('PartnerName')
            .orderBy('SUM(Enrolled)', 'DESC')
            .getRawMany();
    }
}
