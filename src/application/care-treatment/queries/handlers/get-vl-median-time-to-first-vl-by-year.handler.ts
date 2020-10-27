import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToFirstVL } from '../../../../entities/care_treatment/fact-ct-time-to-first-vl-grp.model';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByYearQuery } from '../get-vl-median-time-to-first-vl-by-year.query';

@QueryHandler(GetVlMedianTimeToFirstVlByYearQuery)
export class GetVlMedianTimeToFirstVlByYearHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByYearQuery> {
    constructor(
        @InjectRepository(FactCTTimeToFirstVL, 'mssql')
        private readonly repository: Repository<FactCTTimeToFirstVL>
    ) {

    }

    async execute(query: GetVlMedianTimeToFirstVlByYearQuery): Promise<any> {
        const medianTimeToFirstVlSql = `
            SELECT
                DISTINCT
                year(StartARTDate) year,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY [TimetoFirstVL] DESC) OVER (PARTITION BY Year(StartARTDate)) AS time
            FROM (    
                SELECT
                    CASE WHEN StartARTDate <= [FirstVLDate] THEN DATEDIFF(dd,StartARTDate,[FirstVLDate]) ELSE 0 END as TimetoFirstVL,
                    StartARTDate
                FROM Fact_Trans_New_Cohort
                WHERE MFLCode > 1 AND Year(StartARTDate) >= 2004
            ) TimetoFirstVL
            ORDER BY Year(StartARTDate)
        `;
        return await this.repository.query(medianTimeToFirstVlSql);
    }
}
