import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransRetention } from '../../entities/fact-trans-retention.model';
import { GetVlSuppressionByYearQuery } from '../impl/get-vl-suppression-by-year.query';

@QueryHandler(GetVlSuppressionByYearQuery)
export class GetVlSuppressionByYearHandler implements IQueryHandler<GetVlSuppressionByYearQuery> {
    constructor(
        @InjectRepository(FactTransRetention, 'mssql')
        private readonly repository: Repository<FactTransRetention>
    ) {
    }

    async execute(query: GetVlSuppressionByYearQuery): Promise<any> {
        const vlSuppressionByYear = this.repository.createQueryBuilder('f')
            .select(['f.StartART_Year year, SUM([3Mstatus]) retention3Months, SUM([6Mstatus]) retention6Months, SUM([12Mstatus]) retention12Months, SUM([18Mstatus]) retention24Months'])
            .where('f.MFLCode > 0')
            .andWhere('f.StartART_Year IS NOT NULL')
            .andWhere('f.Last12MVLResult = :suppression', { suppression: "SUPPRESSED" })
            .andWhere('f.StartART_Year >= :year', { year: 2011 });

        if (query.county) {
            vlSuppressionByYear.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByYear.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByYear.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByYear.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByYear.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await vlSuppressionByYear
            .groupBy('f.StartART_Year')
            .orderBy('f.StartART_Year')
            .getRawMany();
    }
}
