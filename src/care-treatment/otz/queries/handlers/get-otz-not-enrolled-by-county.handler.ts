import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzNotEnrolledByCountyQuery } from '../impl/get-otz-not-enrolled-by-county.query';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzNotEnrolledByCountyQuery)
export class GetOtzNotEnrolledByCountyHandler
    implements IQueryHandler<GetOtzNotEnrolledByCountyQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>,
    ) {}

    async execute(query: GetOtzNotEnrolledByCountyQuery): Promise<any> {
        const proportionWhoCompletedTraining = this.repository
            .createQueryBuilder('f')
            .select(['SUM(Enrolled) Num, County']);

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
                'f.CTPartner IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            proportionWhoCompletedTraining.andWhere(
                'f.CTAgency IN (:...agencies)',
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
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        return await proportionWhoCompletedTraining
            .groupBy('County')
            .orderBy('SUM(Enrolled)', 'DESC')
            .getRawMany();
    }
}
