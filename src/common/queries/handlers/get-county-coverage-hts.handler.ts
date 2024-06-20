import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetCountyCoverageHtsQuery } from '../impl/get-county-coverage-hts.query';

@QueryHandler(GetCountyCoverageHtsQuery)
export class GetCountyCoverageHtsHandler implements IQueryHandler<GetCountyCoverageHtsQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetCountyCoverageHtsQuery): Promise<any> {
        const htsCountyCoverage = this.repository
            .createQueryBuilder('q')
            .select([
                'q.County',
                'COALESCE(SUM(Tested_Total), 0) AS Tested_DHIS',
                'coalesce (Sum(Tested),0) as Tested_NDW',
                'coalesce (Sum(Positive_Total),0) as Positive_DHIS',
                'coalesce (Sum(Positive),0) as Positive_NDW'
            ])
            .leftJoin(
                `(Select MFLCode, sum (Tested) as Tested, sum (Positive) as Positive, AsOfDate FROM REPORTING.dbo.AggregateHTSUptake WHERE AsOfDate =EOMONTH(DATEADD(mm,-1,GETDATE())) group by MFLcode,AsOfDate)`,
                'ndw',
                'q.MFLCode = ndw.MFLCode'
            )
            .leftJoin(
                `(Select MFLCode, ReportMonth_Year as reporting_month_HTS, Tested_Total, Positive_Total FROM REPORTING.dbo.AggregateFACT_HTS_DHIS2 dhis where Tested_Total is not null and datediff( mm, cast(concat(ReportMonth_Year, '01') as date), (select max(cast(concat(ReportMonth_Year, '01') as date)) from ODS.dbo.HTS_DHIS2)) = 0 group by MFLCode, ReportMonth_Year, Tested_Total, Positive_Total)`,
                'hts',
                'q.MFLCode = hts.MFLCode'
            )
            .where(`EMR_Status='Active'`);

        if (query.county) {
            htsCountyCoverage.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            htsCountyCoverage.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        return await htsCountyCoverage
            .groupBy('q.County')
            .orderBy('q.County')
            .getRawMany();
    }
}
