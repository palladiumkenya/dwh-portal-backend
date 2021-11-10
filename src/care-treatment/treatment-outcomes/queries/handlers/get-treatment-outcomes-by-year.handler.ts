import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesByYearQuery } from '../impl/get-treatment-outcomes-by-year.query';
import moment = require('moment');

@QueryHandler(GetTreatmentOutcomesByYearQuery)
export class GetTreatmentOutcomesByYearHandler implements IQueryHandler<GetTreatmentOutcomesByYearQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {

    }

    async execute(query: GetTreatmentOutcomesByYearQuery): Promise<any> {
        let fromDate = "2011-01-01";
        let toDate = moment().startOf('month').subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
        if (query.fromDate) {
            fromDate = moment(query.fromDate, 'YYYY-MM-DD').startOf('month').format("YYYY-MM-DD");
        }
        if (query.toDate) {
            toDate = moment(query.toDate, 'YYYY-MM-DD').endOf('month').format("YYYY-MM-DD");
        }
        const treatmentOutcomes = this.repository.createQueryBuilder('f')
            .select(['ARTOutcome artOutcome, SUM(TotalOutcomes) totalOutcomes, StartYear year'])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcome IS NOT NULL')
            .andWhere('f.StartYear IS NOT NULL')
            .andWhere("CAST(CONCAT(StartYear , '-' , StartMonth,'-' , '01') AS Date) BETWEEN :fromDate AND :toDate", {
                fromDate: fromDate,
                toDate: toDate
            });

        if (query.county) {
            treatmentOutcomes.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            treatmentOutcomes.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            treatmentOutcomes.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            treatmentOutcomes.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            treatmentOutcomes.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await treatmentOutcomes
            .groupBy('f.StartYear, f.ARTOutcome')
            .orderBy('f.ARTOutcome, f.StartYear')
            .getRawMany();
    }
}
