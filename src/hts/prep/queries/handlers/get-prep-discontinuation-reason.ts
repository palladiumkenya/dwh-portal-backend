import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepDiscontinuationReasonQuery } from '../impl/get-prep-discontinuation-reason.query';

@QueryHandler(GetPrepDiscontinuationReasonQuery)
export class GetPrepDiscontinuationReasonHandler
    implements IQueryHandler<GetPrepDiscontinuationReasonQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepDiscontinuationReasonQuery): Promise<any> {
        let params = []
        let prepDiscontinuation = `SELECT
                SUM(PrepDiscontinuations) AS PrepDiscontinuations, 
                ExitReason
            FROM [AggregatePrepDiscontinuation]
            where ExitYear is not null`;
        // this.repository
        //     .createQueryBuilder('f')
        //     .select([
        //         'COUNT ( DISTINCT ( concat ( PrepNumber, PatientPk, SiteCode ) )  )AS PrepDiscontinuations, ExitReason',
        //     ])
        //     .where(
        //         'ExitDate is not null and  DATEDIFF(month, ExitDate, GETDATE()) = 2',
        //     );

        if (query.county) {
            prepDiscontinuation = `${prepDiscontinuation} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            prepDiscontinuation = `${prepDiscontinuation} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            prepDiscontinuation = `${prepDiscontinuation} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            prepDiscontinuation = `${prepDiscontinuation} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.agency) {
            prepDiscontinuation = `${prepDiscontinuation} and AgencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.gender) {
            prepDiscontinuation = `${prepDiscontinuation} and Sex IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.datimAgeGroup) {
            prepDiscontinuation = `${prepDiscontinuation} and AgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.year) {
            prepDiscontinuation = `${prepDiscontinuation} and ExitYear = ${query.year}`;
        }

        if (query.month) {
            prepDiscontinuation = `${prepDiscontinuation} and ExitMonth = ${query.month}`;
        }

        prepDiscontinuation = `${prepDiscontinuation} GROUP BY ExitReason
                    ORDER BY PrepDiscontinuations DESC
        `;

        return await this.repository.query(prepDiscontinuation, params);
    }
}
