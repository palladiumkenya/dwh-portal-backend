import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../entities/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByPartnerQuery } from '../impl/get-median-time-to-art-by-partner.query';

@QueryHandler(GetMedianTimeToArtByPartnerQuery)
export class GetMedianTimeToArtByPartnerHandler implements IQueryHandler<GetMedianTimeToArtByPartnerQuery> {
    constructor(
        @InjectRepository(FactCTTimeToArt, 'mssql')
        private readonly repository: Repository<FactCTTimeToArt>
    ) {

    }

    async execute(query: GetMedianTimeToArtByPartnerQuery): Promise<any> {
        const medianTimeToArtSql = `
            SELECT * FROM (
                SELECT
                    DISTINCT
                    CTPartner partner,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TimeToART DESC) OVER (PARTITION BY CTPartner) AS time
                FROM (
                    SELECT
                        CASE WHEN EnrollmentDate <= StartARTDate THEN DATEDIFF(dd,EnrollmentDate,StartARTDate) ELSE 0 END as TimeToART,
                        EnrollmentDate,
                        CTPartner
                    FROM Fact_Trans_New_Cohort
                    WHERE MFLCode > 1 AND CTPartner is not null AND CTPartner <> '' AND Year(EnrollmentDate) >= 2011 AND EnrollmentDate <= GETDATE()
                ) TimeToART
            ) a
            ORDER BY a.time DESC
        `;
        return await this.repository.query(medianTimeToArtSql);
    }
}
