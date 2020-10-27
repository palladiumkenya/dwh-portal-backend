import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToFirstVL } from '../../../../entities/care_treatment/fact-ct-time-to-first-vl-grp.model';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByCountyQuery } from '../get-vl-median-time-to-first-vl-by-county.query';

@QueryHandler(GetVlMedianTimeToFirstVlByCountyQuery)
export class GetVlMedianTimeToFirstVlByCountyHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByCountyQuery> {
    constructor(
        @InjectRepository(FactCTTimeToFirstVL, 'mssql')
        private readonly repository: Repository<FactCTTimeToFirstVL>
    ) {

    }

    async execute(query: GetVlMedianTimeToFirstVlByCountyQuery): Promise<any> {
        const medianTimeToFirstVlSql = `
            SELECT * FROM (
                SELECT
                    DISTINCT
                    County county,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY [TimetoFirstVL] DESC) OVER (PARTITION BY County) AS time
                FROM (
                    SELECT
                        CASE WHEN StartARTDate <= [FirstVLDate] THEN DATEDIFF(dd,StartARTDate,[FirstVLDate]) ELSE 0 END as [TimetoFirstVL],
                        StartARTDate,
                        County
                    FROM Fact_Trans_New_Cohort
                    WHERE MFLCode > 1 AND county is not null AND Year(StartARTDate) >= 2004
                ) [TimetoFirstVL]
                ) a
            ORDER BY a.county ASC
        `;
        return await this.repository.query(medianTimeToFirstVlSql);
    }
}
