import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConsistencyByFacilityQuery } from '../impl/get-consistency-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { ConsistencyByFacilityDto } from '../../entities/dtos/consistency-by-facility.dto';
import moment = require('moment');

@QueryHandler(GetConsistencyByFacilityQuery)
export class GetConsistencyByFacilityHandler
    implements IQueryHandler<GetConsistencyByFacilityQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetConsistencyByFacilityQuery,
    ): Promise<ConsistencyByFacilityDto> {
        const params = [];
        params.push(query.docket.toLowerCase());
        let fromDate
        let toDate

        if (query.period) {
            fromDate = moment(query.period, 'YYYY,MMM')
                .startOf('month')
                .subtract(1, 'month')
                .format('YYYY-MM-DD');
            toDate = moment(query.period, 'YYYY,MMM')
                .startOf('month')
                .subtract(1, 'month')
                .endOf('month')
                .format('YYYY-MM-DD');
            params.push(fromDate);
            params.push(toDate);
        } else {
            fromDate = moment()
                .startOf('month')
                .subtract(1, 'month')
                .format('YYYY-MM-DD');
            toDate = moment()
                .startOf('month')
                .subtract(1, 'month')
                .endOf('month')
                .format('YYYY-MM-DD');
            params.push(fromDate);
            params.push(toDate);
        }
        let consistencyByFacilitySql;
        if (query.docket.toLowerCase() === 'hts') {
            consistencyByFacilitySql = `select
                d.MFLCode, FacilityName,County, Subcounty, AgencyName Agency, PartnerName Partner,
                CASE WHEN NumberOfUploads is NULL THEN 0 ELSE NumberOfUploads END AS NumberOfUploads
                from all_EMRSites d
                left join (
                    SELECT DISTINCT facilityId,NumberOfUploads FROM (
                        SELECT fm.facilityId,fm.docketid as docket,
                            count(*) NumberOfUploads
                        FROM  NDWH.dbo.Fact_manifest fm
                        WHERE fm.docketid = '${query.docket.toLowerCase()}' AND
                            fm.timeId BETWEEN DATEADD(MONTH, -2, EOMONTH(cast('${fromDate}' as date), -1)) AND EOMONTH(cast('${toDate}' as date)) 
                        GROUP BY facilityId, docketId
                    ) X
                ) f on d.MFLCode = f.facilityId 
                where isHts = 1 and (NumberOfUploads <3 OR NumberOfUploads is NULL) `;
        } else {
            consistencyByFacilitySql = `select
                MFLCode,FacilityName,County,Subcounty, AgencyName Agency,PartnerName Partner,
                case when NumberOfUploads is NULL THEN 0 ELSE NumberOfUploads END AS NumberOfUploads
                from all_EMRSites d
                left join (
                    SELECT DISTINCT facilityId,NumberOfUploads FROM (
                        SELECT fm.facilityId,fm.docketid as docket,
                            count(*) NumberOfUploads
                        FROM  NDWH.dbo.Fact_manifest fm
                        WHERE fm.docketid = '${query.docket.toLowerCase()}' AND
                            fm.timeId BETWEEN DATEADD(MONTH, -2, EOMONTH(cast('${fromDate}' as date), -1)) AND EOMONTH(cast('${toDate}' as date)) 
                        GROUP BY facilityId, docketId
                    ) X
                ) f on d.MFLCode = f.facilityId
                where isCt = 1 and (NumberOfUploads <3 OR NumberOfUploads is NULL) `;
        }


        // if (query.reportingType === '0') {
        //     consistencyByFacilitySql = `${consistencyByFacilitySql} AND NumberOfUploads is null `;
        // } else {
        //     consistencyByFacilitySql = `${consistencyByFacilitySql} AND NumberOfUploads is not null `;
        // }

        if (query.county) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.agency) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and agencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`
        }

        return await this.repository.query(consistencyByFacilitySql, params);
    }
}
