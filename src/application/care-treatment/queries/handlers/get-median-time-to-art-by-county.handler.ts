import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../../../entities/care_treatment/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByCountyQuery } from '../get-median-time-to-art-by-county.query';

@QueryHandler(GetMedianTimeToArtByCountyQuery)
export class GetMedianTimeToArtByCountyHandler implements IQueryHandler<GetMedianTimeToArtByCountyQuery> {
    constructor(
        @InjectRepository(FactCTTimeToArt, 'mssql')
        private readonly repository: Repository<FactCTTimeToArt>
    ) {

    }

    async execute(query: GetMedianTimeToArtByCountyQuery): Promise<any> {
        const medianTimeToArtSql = `
            SELECT * FROM (
                SELECT
                    DISTINCT
                    County county,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TimeToART DESC) OVER (PARTITION BY County) AS time
                FROM (
                    SELECT
                        CASE WHEN EnrollmentDate <= StartARTDate THEN DATEDIFF(dd,EnrollmentDate,StartARTDate) ELSE 0 END as TimeToART,
                        EnrollmentDate,
                        County
                    FROM Fact_Trans_New_Cohort
                    WHERE MFLCode > 1 AND county is not null AND Year(EnrollmentDate) >= 2011 AND EnrollmentDate <= GETDATE()
                ) TimeToART
            ) a
            ORDER BY a.time DESC
        `;
        return await this.repository.query(medianTimeToArtSql);
    }
}
