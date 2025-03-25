import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesByAgeQuery } from '../impl/get-treatment-outcomes-by-age.query';
import moment = require('moment');
import { AggregateTreatmentOutcomes } from '../../entities/aggregate-treatment-outcomes.model';

@QueryHandler(GetTreatmentOutcomesByAgeQuery)
export class GetTreatmentOutcomesByAgeHandler
    implements IQueryHandler<GetTreatmentOutcomesByAgeQuery> {
    constructor(
        @InjectRepository(AggregateTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<AggregateTreatmentOutcomes>,
    ) {}

    async execute(query: GetTreatmentOutcomesByAgeQuery): Promise<any> {
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
                'ARTOutcomeDescription artOutcome, SUM(TotalOutcomes) totalOutcomes,AgeGroup ageGroup',
            ])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.ARTOutcomeDescription IS NOT NULL')
            .andWhere('f.AgeGroup IS NOT NULL')
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

        return await treatmentOutcomes
            .groupBy('f.ageGroup, f.ARTOutcomeDescription')
            .orderBy('f.ARTOutcomeDescription, f.ageGroup')
            .getRawMany();
    }
}
