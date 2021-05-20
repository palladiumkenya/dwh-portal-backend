import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesOverallLast12mQuery } from '../impl/get-treatment-outcomes-overall-last-12m.query';
import moment = require('moment');

@QueryHandler(GetTreatmentOutcomesOverallLast12mQuery)
export class GetTreatmentOutcomesOverallLast12mHandler implements IQueryHandler<GetTreatmentOutcomesOverallLast12mQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {

    }

    async execute(query: GetTreatmentOutcomesOverallLast12mQuery): Promise<any> {
        const months = [];
        const years = [];
        for(var i=0; i < 13; i++)
        {
            const date = moment().startOf('month').subtract(i+1, 'month');
            const month = parseInt(date.format('M'));
            const year = parseInt(date.format('YYYY'));
            if (months.indexOf(month) === -1) {
                months.push(month)
            }
            if (years.indexOf(year) === -1) {
                years.push(year)
            }
        }
        
        const treatmentOutcomes = this.repository.createQueryBuilder('f')
            .select(['ARTOutcome artOutcome, SUM(TotalOutcomes) totalOutcomes'])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcome IS NOT NULL');

        if (months.length) {
            treatmentOutcomes.andWhere('f.StartMonth IN (:...months)', { months });
        }

        if (years.length) {
            treatmentOutcomes.andWhere('f.StartYear IN (:...years)', { years });
        }

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

        return await treatmentOutcomes
            .groupBy('f.artOutcome')
            .getRawMany();
    }
}
