import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtViralLoadSuppressionPercentageQuery } from '../impl/get-ct-viral-load-suppression-percentage.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetCtViralLoadSuppressionPercentageQuery)
export class GetCtViralLoadSuppressionPercentageHandler
    implements IQueryHandler<GetCtViralLoadSuppressionPercentageQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(
        query: GetCtViralLoadSuppressionPercentageQuery,
    ): Promise<any> {
        const viralLoadPercentage = this.repository
            .createQueryBuilder('f')
            .select([
                '[Sex] Gender, SUM([Last12MVLSup]) Suppressed, SUM([Last12MonthVL]) Last12MonthVL',
            ])
            .where('f.[Sex] IS NOT NULL');

        if (query.county) {
            viralLoadPercentage.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            viralLoadPercentage.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            viralLoadPercentage.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        /*if(query.month) {
            viralLoadCascade.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            viralLoadCascade.andWhere('f.Start_Year = :startYear', { startYear: query.year });
        }*/

        return await viralLoadPercentage.groupBy('f.[Sex]').getRawMany();
    }
}
