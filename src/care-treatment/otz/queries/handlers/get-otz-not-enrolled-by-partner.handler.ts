import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzNotEnrolledByPartnerQuery } from '../impl/get-otz-not-enrolled-by-partner.query';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';

@QueryHandler(GetOtzNotEnrolledByPartnerQuery)
export class GetOtzNotEnrolledByPartnerHandler
    implements IQueryHandler<GetOtzNotEnrolledByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>,
    ) {}

    async execute(query: GetOtzNotEnrolledByPartnerQuery): Promise<any> {
        const proportionWhoCompletedTraining = this.repository
            .createQueryBuilder('f')
            .select(['SUM(TXCurr) Num, CTPartner'])
            .andWhere('f.OTZEnrollmentDate IS NULL');

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
                'f.DATIM_AgeGroup IN (:...ageGroups)',
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
            .groupBy('CTPartner')
            .orderBy('SUM(TXCurr)', 'DESC')
            .getRawMany();
    }
}
