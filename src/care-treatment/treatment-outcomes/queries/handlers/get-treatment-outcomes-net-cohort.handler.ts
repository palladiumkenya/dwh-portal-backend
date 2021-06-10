import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTreatmentOutcomesNetCohortQuery } from '../impl/get-treatment-outcomes-net-cohort.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { Repository } from 'typeorm';
import moment = require('moment');

@QueryHandler(GetTreatmentOutcomesNetCohortQuery)
export class GetTreatmentOutcomesNetCohortHandler implements IQueryHandler<GetTreatmentOutcomesNetCohortQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {

    }

    async execute(query: GetTreatmentOutcomesNetCohortQuery): Promise<any> {
        let fromDate = moment().startOf('month').subtract(12, 'month').format("YYYY-MM-DD");
        let toDate = moment().startOf('month').subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
        if (query.fromDate) {
            fromDate = moment(query.fromDate, 'YYYY-MM-DD').startOf('month').format("YYYY-MM-DD");
        }
        if (query.toDate) {
            toDate = moment(query.toDate, 'YYYY-MM-DD').endOf('month').format("YYYY-MM-DD");
        }

        const netCohort = this.repository.createQueryBuilder('f')
            .select(['ARTOutcome artOutcome, SUM(TotalOutcomes) totalOutcomes'])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcome in (\'Active\',\'Dead\',\'LTFU\')')
            .andWhere("CAST(CONCAT(StartYear , '-' , StartMonth,'-' , '01') AS Date) BETWEEN :fromDate AND :toDate", {
                fromDate: fromDate,
                toDate: toDate
            });

        if (query.county) {
            netCohort.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            netCohort.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            netCohort.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            netCohort.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await netCohort
            .groupBy('f.artOutcome')
            .getRawMany();
    }
}