import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtViralLoadSuppressionPercentageQuery } from '../get-ct-viral-load-suppression-percentage.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtViralLoadSuppressionPercentageQuery)
export class GetCtViralLoadSuppressionPercentageHandler implements IQueryHandler<GetCtViralLoadSuppressionPercentageQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtViralLoadSuppressionPercentageQuery): Promise<any> {
        const viralLoadPercentage = this.repository.createQueryBuilder('f')
            .select(['[Gender], SUM([Last12MVLSup]) Suppressed, SUM([Last12MonthVL]) Last12MonthVL'])
            .where('f.[Gender] IS NOT NULL');

        if (query.county) {
            viralLoadPercentage
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralLoadPercentage
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralLoadPercentage
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        /*if(query.month) {
            viralLoadCascade.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            viralLoadCascade.andWhere('f.Start_Year = :startYear', { startYear: query.year });
        }*/

        return await viralLoadPercentage
            .groupBy('f.[Gender]')
            .getRawMany();
    }
}
