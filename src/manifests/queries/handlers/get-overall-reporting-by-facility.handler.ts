import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverallReportingByFacilityQuery } from '../impl/get-overall-reporting-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { OverallReportingByFacilityDto } from '../../entities/dtos/overall-reporting-by-facility.dto';
import moment = require('moment');

@QueryHandler(GetOverallReportingByFacilityQuery)
export class GetOverallReportingByFacilityHandler implements IQueryHandler<GetOverallReportingByFacilityQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetOverallReportingByFacilityQuery): Promise<OverallReportingByFacilityDto> {
        const params = [];
        let overAllReportingByFacilitySql;
        if (query.docket.toLowerCase() === 'hts') {
            overAllReportingByFacilitySql = `Select Distinct df.FacilityId,Name as FacilityName,County,subCounty,Agency,Partner, f.year,f.month, f.docketId ,f.timeId as uploaddate
                from (select name,facilityId,county,subcounty,agency,partner, ? AS docket from dim_facility where isHts = 1) df
                LEFT JOIN (SELECT * FROM (
                            SELECT DISTINCT ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                            FacilityId,docketId,fm.timeId, dt.year,dt.month FROM  fact_manifest fm
                            inner join dim_time dt on dt.timeId=fm.timeId
                            where dt.year = ? and dt.month = ?
                )u where RowId=1) f on f.facilityId=df.facilityId and df.docket=f.docketId
                Where docket IS NOT NULL `;
        } else if (query.docket.toLowerCase() === 'pkv') {
            overAllReportingByFacilitySql = `Select Distinct df.FacilityId,Name as FacilityName,County,subCounty,Agency,Partner, f.year,f.month, f.docketId ,f.timeId as uploaddate
                from (select name,facilityId,county,subcounty,agency,partner, ? AS docket from dim_facility where isPkv = 1) df
                LEFT JOIN (SELECT * FROM (
                            SELECT DISTINCT ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                            FacilityId,docketId,fm.timeId, dt.year,dt.month FROM  fact_manifest fm
                            inner join dim_time dt on dt.timeId=fm.timeId
                            where dt.year = ? and dt.month = ?
                )u where RowId=1) f on f.facilityId=df.facilityId and df.docket=f.docketId
                Where docket IS NOT NULL `;
        } else {
            overAllReportingByFacilitySql = `Select Distinct df.FacilityId,Name as FacilityName,County,subCounty,Agency,Partner, f.year,f.month, f.docketId ,f.timeId as uploaddate
                from (select name,facilityId,county,subcounty,agency,partner, ? AS docket from dim_facility where isCt = 1) df
                LEFT JOIN (SELECT * FROM (
                            SELECT DISTINCT ROW_NUMBER ( ) OVER (PARTITION BY FacilityId,docketId,Concat(Month(fm.timeId),'-', Year(fm.timeId)) ORDER BY (cast(fm.timeId as date)) desc) AS RowID,
                            FacilityId,docketId,fm.timeId, dt.year,dt.month FROM  fact_manifest fm
                            inner join dim_time dt on dt.timeId=fm.timeId
                            where dt.year = ? and dt.month = ?
                )u where RowId=1) f on f.facilityId=df.facilityId and df.docket=f.docketId
                Where docket IS NOT NULL `;
        }

        params.push(query.docket.toLowerCase());

        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            params.push(year);
            params.push(month);
        } else {
            const month = moment().startOf('month').subtract(1, 'month').format("MM");
            const year = moment().startOf('month').subtract(1, 'month').format("YYYY");
            params.push(year);
            params.push(month);
        }

        if (query.reportingType === '0') {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and timeid is null `;
        } else {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and timeid is not null `;
        }

        if (query.county) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and Name IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            overAllReportingByFacilitySql = `${overAllReportingByFacilitySql} and Agency IN (?)`;
            params.push(query.agency);
        }

        return await this.repository.query(overAllReportingByFacilitySql, params);
    }
}
