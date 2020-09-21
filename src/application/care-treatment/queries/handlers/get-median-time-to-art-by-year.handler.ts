import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../../../entities/care_treatment/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByYearQuery } from '../get-median-time-to-art-by-year.query';

@QueryHandler(GetMedianTimeToArtByYearQuery)
export class GetMedianTimeToArtByYearHandler implements IQueryHandler<GetMedianTimeToArtByYearQuery> {
    constructor(
        @InjectRepository(FactCTTimeToArt, 'mssql')
        private readonly repository: Repository<FactCTTimeToArt>
    ) {

    }

    async execute(query: GetMedianTimeToArtByYearQuery): Promise<any> {
        const medianTimeToArtSql = `
            SELECT
                DISTINCT
                year(EnrollmentDate) year,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TimeToART DESC) OVER (PARTITION BY Year(EnrollmentDate)) AS time
            FROM (    
                SELECT
                    CASE WHEN EnrollmentDate <= StartARTDate THEN DATEDIFF(dd,EnrollmentDate,StartARTDate) ELSE 0 END as TimeToART,
                    EnrollmentDate
                FROM Fact_Trans_New_Cohort
                WHERE MFLCode > 1 AND Year(EnrollmentDate) >= 2011
            ) TimeToART
            ORDER BY Year(EnrollmentDate)
        `;
        return await this.repository.query(medianTimeToArtSql);
    }
}
