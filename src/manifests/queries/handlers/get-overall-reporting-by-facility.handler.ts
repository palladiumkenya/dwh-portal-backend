import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverallReportingByFacilityQuery } from '../impl/get-overall-reporting-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { OverallReportingByFacilityDto } from '../../entities/dtos/overall-reporting-by-facility.dto';
import moment = require('moment');

@QueryHandler(GetOverallReportingByFacilityQuery)
export class GetOverallReportingByFacilityHandler
    implements IQueryHandler<GetOverallReportingByFacilityQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetOverallReportingByFacilityQuery,
    ): Promise<OverallReportingByFacilityDto> {
        const params = [];
        let year = moment()
                .startOf('month')
                .subtract(1, 'month')
                .format('YYYY');
        let month = moment()
                .startOf('month')
                .subtract(1, 'month')
                .format('MM')
        params.push(query.docket.toLowerCase());

        if (query.period) {
            year = query.period.split(',')[0];
            month = query.period.split(',')[1];
            params.push(year);
            params.push(month);
        } else {
            month = moment()
                .startOf('month')
                .subtract(1, 'month')
                .format('MM');
            year = moment()
                .startOf('month')
                .subtract(1, 'month')
                .format('YYYY');
            params.push(year);
            params.push(month);
        }

        let overAllReportingByFacilitySql;
        if (query.docket.toLowerCase() === 'hts') {
            overAllReportingByFacilitySql = `SELECT * 
                from 
                (
                    Select Distinct 
                        df.FacilityId,
                        Name as FacilityName,
                        County,
                        subCounty,
                        Agency,
                        Partner, 
                        f.year,
                        f.month, 
                        f.docketId ,
                        f.timeId as uploaddate
                    from (
                        select 
                            FacilityName name,
                            MFLCode facilityId,
                            county,
                            subcounty,
                            AgencyName agency,
                            PartnerName partner, 
                            '${query.docket.toLowerCase()}' AS docket 
                        from REPORTING.dbo.all_EMRSites 
                        where isHts = 1
                    ) df
                    LEFT JOIN (
                        SELECT * FROM (
                            SELECT DISTINCT 
                                ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                                FacilityId,
                                docketId,
                                fm.timeId, 
                                year(timeId) year,
                                month(timeId) month 
                            FROM  NDWH.dbo.Fact_manifest fm
                            where year(timeId) = ${year} and month(timeId) = ${month}
                        )u 
                        where RowId=1
                    ) f on f.facilityId=df.facilityId and df.docket=f.docketId
                ) Y `;
        } else if (query.docket.toLowerCase() === 'pkv') {
            overAllReportingByFacilitySql = `SELECT * 
                from 
                (
                    Select Distinct 
                        df.FacilityId,
                        Name as FacilityName,
                        County,
                        subCounty,
                        Agency,
                        Partner, 
                        f.year,
                        f.month, 
                        f.docketId ,
                        f.timeId as uploaddate
                    from (
                        select 
                            FacilityName name,
                            MFLCode facilityId,
                            county,
                            subcounty,
                            AgencyName agency,
                            PartnerName partner, 
                            '${query.docket.toLowerCase()}' AS docket 
                        from REPORTING.dbo.all_EMRSites 
                        where isPkv = 1
                    ) df
                    LEFT JOIN (
                        SELECT * FROM (
                            SELECT DISTINCT 
                                ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                                FacilityId,
                                docketId,
                                fm.timeId, 
                                year(timeId) year,
                                month(timeId) month 
                            FROM  NDWH.dbo.Fact_manifest fm
                            where year(timeId) = ${year} and month(timeId) = ${month}
                        )u 
                        where RowId=1
                    ) f on f.facilityId=df.facilityId and df.docket=f.docketId
                ) Y `;
        } else {
            overAllReportingByFacilitySql = `SELECT * 
                from 
                (
                    Select Distinct 
                        df.FacilityId,
                        Name as FacilityName,
                        County,
                        subCounty,
                        Agency,
                        Partner, 
                        f.year,
                        f.month, 
                        f.docketId ,
                        f.timeId as uploaddate
                    from (
                        select 
                            FacilityName name,
                            MFLCode facilityId,
                            county,
                            subcounty,
                            AgencyName agency,
                            PartnerName partner, 
                            '${query.docket.toLowerCase()}' AS docket 
                        from REPORTING.dbo.all_EMRSites 
                        where isCT = 1
                    ) df
                    LEFT JOIN (
                        SELECT * FROM (
                            SELECT DISTINCT 
                                ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                                FacilityId,
                                docketId,
                                fm.timeId, 
                                year(timeId) year,
                                month(timeId) month 
                            FROM  NDWH.dbo.Fact_manifest fm
                            where year(timeId) = ${year} and month(timeId) = ${month}
                        )u 
                        where RowId=1
                    ) f on f.facilityId=df.facilityId and df.docket=f.docketId
                ) Y `;
        }

        if (query.reportingType === '0') {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} WHERE uploaddate is null `;
        } else {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} WHERE uploaddate is not null `;
        }

        if (query.county) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and FacilityFacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and Partner IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.agency) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and agency IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`
        }

        return await this.repository.query(
            overAllReportingByFacilitySql,
            params,
        );
    }
}
