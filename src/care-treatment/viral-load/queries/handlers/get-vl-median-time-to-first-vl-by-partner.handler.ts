import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToFirstVL } from '../../entities/fact-ct-time-to-first-vl-grp.model';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByPartnerQuery } from '../impl/get-vl-median-time-to-first-vl-by-partner.query';

@QueryHandler(GetVlMedianTimeToFirstVlByPartnerQuery)
export class GetVlMedianTimeToFirstVlByPartnerHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByPartnerQuery> {
    constructor(
        @InjectRepository(FactCTTimeToFirstVL, 'mssql')
        private readonly repository: Repository<FactCTTimeToFirstVL>
    ) {

    }

    async execute(query: GetVlMedianTimeToFirstVlByPartnerQuery): Promise<any> {
        const medianTimeToFirstVlSql = `
            SELECT * FROM (
                SELECT
                    DISTINCT
                    CTPartner partner,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY [TimetoFirstVL] DESC) OVER (PARTITION BY CTPartner) AS time
                FROM (
                    SELECT
                        CASE WHEN StartARTDate <= [FirstVLDate] THEN DATEDIFF(dd,StartARTDate,[FirstVLDate]) ELSE 0 END as [TimetoFirstVL],
                        StartARTDate,
                        CTPartner
                    FROM Fact_Trans_New_Cohort
                    WHERE MFLCode > 1 AND CTPartner is not null AND CTPartner <> '' AND Year(StartARTDate) >= 2004
                ) [TimetoFirstVL]
            ) a
            ORDER BY a.time DESC
        `;
        return await this.repository.query(medianTimeToFirstVlSql);
    }
}
