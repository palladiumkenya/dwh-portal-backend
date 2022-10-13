import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzEnrollmentTrendQuery } from './../impl/get-otz-enrollment-trend.query';
import moment = require('moment');

@QueryHandler(GetOtzEnrollmentTrendQuery)
export class GetOtzEnrollmentTrentHandler
    implements IQueryHandler<GetOtzEnrollmentTrendQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>,
    ) {}

    async execute(query: GetOtzEnrollmentTrendQuery): Promise<any> {
        const previousMonth = moment()
            .subtract(2, 'month')
            .add(16, 'days')
            .endOf('month')
            .format('YYYY-MM-DD');
        const otzEnrolled = this.repository
            .createQueryBuilder('f')
            .select([
                "count( * ) enrolledInOTZ, MONTH ( OTZEnrollmentDate ) 'month', YEAR ( OTZEnrollmentDate ) 'year'",
            ])
            .where(
                `f.OTZEnrollmentDate IS NOT NULL and OTZEnrollmentDate <= '${previousMonth}'`,
            );

        if (query.county) {
            otzEnrolled.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            otzEnrolled.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            otzEnrolled.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            otzEnrolled.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            otzEnrolled.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            otzEnrolled.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            otzEnrolled.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzEnrolled
            .groupBy('MONTH ( OTZEnrollmentDate ), YEAR ( OTZEnrollmentDate ) ')
            .orderBy('YEAR ( OTZEnrollmentDate )', 'DESC')
            .addOrderBy('MONTH ( OTZEnrollmentDate )', 'DESC')
            .getRawMany();
    }
}
