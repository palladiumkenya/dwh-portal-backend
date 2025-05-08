import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTreatmentOutcomesNetCohortQuery } from '../impl/get-treatment-outcomes-net-cohort.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment = require('moment');
import { AggregateTreatmentOutcomes } from '../../entities/aggregate-treatment-outcomes.model';

@QueryHandler(GetTreatmentOutcomesNetCohortQuery)
export class GetTreatmentOutcomesNetCohortHandler
    implements IQueryHandler<GetTreatmentOutcomesNetCohortQuery> {
    constructor(
        @InjectRepository(AggregateTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<AggregateTreatmentOutcomes>,
    ) {}

    async execute(query: GetTreatmentOutcomesNetCohortQuery): Promise<any> {
        let fromDate = moment()
            .startOf('month')
            .subtract(12, 'month')
            .format('YYYY-MM-DD');
        let toDate = moment()
            .startOf('month')
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD');
        if (query.fromDate) {
            fromDate = moment(query.fromDate, 'YYYY-MM-DD')
                .startOf('month')
                .format('YYYY-MM-DD');
        }
        if (query.toDate) {
            toDate = moment(query.toDate, 'YYYY-MM-DD')
                .endOf('month')
                .format('YYYY-MM-DD');
        }

        const netCohort = this.repository
            .createQueryBuilder('f')
            .select([
                'ARTOutcomeDescription artOutcome, SUM(TotalOutcomes) totalOutcomes',
            ])
            .where('f.MFLCode IS NOT NULL')
            .andWhere("f.artOutcomeDescription in ('Active','Dead','LTFU')")
            .andWhere(
                "CAST(CONCAT(StartYear , '-' , StartMonth,'-' , '01') AS Date) BETWEEN :fromDate AND :toDate",
                {
                    fromDate: fromDate,
                    toDate: toDate,
                },
            );

        if (query.county) {
            netCohort.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            netCohort.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            netCohort.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            netCohort.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            netCohort.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            netCohort.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            netCohort.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await netCohort.groupBy('f.artOutcomeDescription').getRawMany();
    }
}
