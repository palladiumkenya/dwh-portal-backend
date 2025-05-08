import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesOverallLast12mQuery } from '../impl/get-treatment-outcomes-overall-last-12m.query';
import moment = require('moment');
import { AggregateTreatmentOutcomes } from '../../entities/aggregate-treatment-outcomes.model';

@QueryHandler(GetTreatmentOutcomesOverallLast12mQuery)
export class GetTreatmentOutcomesOverallLast12mHandler
    implements IQueryHandler<GetTreatmentOutcomesOverallLast12mQuery> {
    constructor(
        @InjectRepository(AggregateTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<AggregateTreatmentOutcomes>,
    ) {}

    async execute(
        query: GetTreatmentOutcomesOverallLast12mQuery,
    ): Promise<any> {
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

        const treatmentOutcomes = this.repository
            .createQueryBuilder('f')
            .select([
                'ARTOutcomeDescription artOutcome, SUM(TotalOutcomes) totalOutcomes',
            ])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcomeDescription IS NOT NULL')
            .andWhere(
                "CAST(CONCAT(StartYear , '-' , StartMonth,'-' , '01') AS Date) BETWEEN :fromDate AND :toDate",
                {
                    fromDate: fromDate,
                    toDate: toDate,
                },
            );

        if (query.county) {
            treatmentOutcomes.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            treatmentOutcomes.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            treatmentOutcomes.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            treatmentOutcomes.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            treatmentOutcomes.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            treatmentOutcomes.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            treatmentOutcomes.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await treatmentOutcomes.groupBy('f.artOutcomeDescription').getRawMany();
    }
}
