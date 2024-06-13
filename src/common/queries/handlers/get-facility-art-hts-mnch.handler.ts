import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityArtHtsMnchQuery } from '../impl/get-facility-art-hts-mnch.query';

@QueryHandler(GetFacilityArtHtsMnchQuery)
export class GetFacilityArtHtsMnchHandler implements IQueryHandler<GetFacilityArtHtsMnchQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityArtHtsMnchQuery): Promise<any> {
        const facilitiesLineList = this.repository
            .createQueryBuilder('q')
            .select([
                'q.KEPH_Level',
                'q.MFLCode as SiteCode',
                'ISNULL(dhis_CT.CurrentOnART_Total, 0) as CurrentOnART_Total',
                'ISNULL(KHIS_HTS.Tested_Total, 0) as Tested_Total',
                'ISNULL(KHIS_PMTCT.onMaternalHAARTtotal, 0) as onMaternalHAARTtotal'
            ])
            .leftJoin(
                `(SELECT SiteCode, CurrentOnART_Total, ReportMonth_Year as reporting_month_CT FROM ODS.dbo.CT_DHIS2 dhis WHERE CurrentOnART_Total IS NOT NULL AND DATEDIFF(mm, CAST(CONCAT(ReportMonth_Year, '01') AS DATE), (SELECT MAX(CAST(CONCAT(ReportMonth_Year, '01') AS DATE)) FROM ODS.dbo.CT_DHIS2)) = 0 GROUP BY SiteCode, ReportMonth_Year, CurrentOnART_Total)`,
            'dhis_CT',
            'q.MFLCode = dhis_CT.SiteCode'
            )
            .leftJoin(
                    `(SELECT SiteCode, Tested_Total, ReportMonth_Year as reporting_month_HTS FROM ODS.dbo.HTS_DHIS2 dhis WHERE Tested_Total IS NOT NULL AND DATEDIFF(mm, CAST(CONCAT(ReportMonth_Year, '01') AS DATE), (SELECT MAX(CAST(CONCAT(ReportMonth_Year, '01') AS DATE)) FROM ODS.dbo.HTS_DHIS2)) = 0 GROUP BY SiteCode, ReportMonth_Year, Tested_Total)`,
                    'KHIS_HTS',
                    'q.MFLCode = KHIS_HTS.SiteCode'
            )
            .leftJoin(
                    `(SELECT SiteCode, onMaternalHAARTtotal, ReportMonth_Year as reporting_month_PMTCT FROM ODS.dbo.MNCH_DHIS2 dhis WHERE onMaternalHAARTtotal IS NOT NULL AND DATEDIFF(mm, CAST(CONCAT(ReportMonth_Year, '01') AS DATE), (SELECT MAX(CAST(CONCAT(ReportMonth_Year, '01') AS DATE)) FROM ODS.dbo.HTS_DHIS2)) = 0 GROUP BY SiteCode, ReportMonth_Year, onMaternalHAARTtotal)`,
                    'KHIS_PMTCT',
                    'q.MFLCode = KHIS_PMTCT.SiteCode'
            );

        if (query.county) {
            facilitiesLineList.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilitiesLineList.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        return await facilitiesLineList
            .orderBy('q.MFLCode')
            .getRawMany();
    }
}
