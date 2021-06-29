import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConsistencyByFacilityQuery } from '../impl/get-consistency-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { ConsistencyByFacilityDto } from '../../entities/dtos/consistency-by-facility.dto';
import moment = require('moment');

@QueryHandler(GetConsistencyByFacilityQuery)
export class GetConsistencyByFacilityHandler implements IQueryHandler<GetConsistencyByFacilityQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetConsistencyByFacilityQuery): Promise<ConsistencyByFacilityDto> {
        const params = [];
        let consistencyByFacilitySql;
        if (query.docket.toLowerCase() === 'hts') {
            consistencyByFacilitySql = `select
                d.facilityId as MFLCode, name as FacilityName,County,Subcounty,Agency,Partner,
                case when NumberOfUploads is NULL THEN 0 ELSE NumberOfUploads END AS NumberOfUploads
                from dim_facility d
                left join (
                    SELECT DISTINCT facilityId,NumberOfUploads,project FROM (
                        SELECT fm.facilityId,fm.docketid as docket,
                            count(*) NumberOfUploads,fm.project
                        FROM  fact_manifest fm
                        WHERE fm.docketid = ? AND
                            fm.timeId BETWEEN DATE_ADD(DATE_ADD(LAST_DAY(date(?) - INTERVAL 2 MONTH), INTERVAL 1 DAY), INTERVAL -1 MONTH) AND
                            LAST_DAY(date(?)) GROUP BY facilityId, docket, project
                    ) X
                ) f on d.facilityId = f.facilityId and d.project = f.project
                where isHts = 1 and (NumberOfUploads <3 OR NumberOfUploads is NULL) `;
        } else if (query.docket.toLowerCase() === 'pkv') {
            consistencyByFacilitySql = `select
                d.facilityId as MFLCode, name as FacilityName,County,Subcounty,Agency,Partner,
                case when NumberOfUploads is NULL THEN 0 ELSE NumberOfUploads END AS NumberOfUploads
                from dim_facility d
                left join (
                    SELECT DISTINCT facilityId,NumberOfUploads,project FROM (
                        SELECT fm.facilityId,fm.docketid as docket,
                            count(*) NumberOfUploads,fm.project
                        FROM  fact_manifest fm
                        WHERE fm.docketid = ? AND
                            fm.timeId BETWEEN DATE_ADD(DATE_ADD(LAST_DAY(date(?) - INTERVAL 2 MONTH), INTERVAL 1 DAY), INTERVAL -1 MONTH) AND
                            LAST_DAY(date(?)) GROUP BY facilityId, docket, project
                    ) X
                ) f on d.facilityId = f.facilityId and d.project = f.project
                where isPkv = 1 and (NumberOfUploads <3 OR NumberOfUploads is NULL) `;
        } else {
            consistencyByFacilitySql = `select
                d.facilityId as MFLCode, name as FacilityName,County,Subcounty,Agency,Partner,
                case when NumberOfUploads is NULL THEN 0 ELSE NumberOfUploads END AS NumberOfUploads
                from dim_facility d
                left join (
                    SELECT DISTINCT facilityId,NumberOfUploads,project FROM (
                        SELECT fm.facilityId,fm.docketid as docket,
                            count(*) NumberOfUploads,fm.project
                        FROM  fact_manifest fm
                        WHERE fm.docketid = ? AND
                            fm.timeId BETWEEN DATE_ADD(DATE_ADD(LAST_DAY(date(?) - INTERVAL 2 MONTH), INTERVAL 1 DAY), INTERVAL -1 MONTH) AND
                            LAST_DAY(date(?)) GROUP BY facilityId, docket, project
                    ) X
                ) f on d.facilityId = f.facilityId and d.project = f.project
                where isCt = 1 and (NumberOfUploads <3 OR NumberOfUploads is NULL) `;
        }

        params.push(query.docket.toLowerCase());

        if (query.period) {
            const fromDate = moment(query.period, 'YYYY,MMM').startOf('month').subtract(1, 'month').format("YYYY-MM-DD");
            const toDate = moment(query.period, 'YYYY,MMM').startOf('month').subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
            params.push(fromDate);
            params.push(toDate);
        } else {
            const fromDate = moment().startOf('month').subtract(1, 'month').format("YYYY-MM-DD");
            const toDate = moment().startOf('month').subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
            params.push(fromDate);
            params.push(toDate);
        }

        // if (query.reportingType === '0') {
        //     consistencyByFacilitySql = `${consistencyByFacilitySql} AND NumberOfUploads is null `;
        // } else {
        //     consistencyByFacilitySql = `${consistencyByFacilitySql} AND NumberOfUploads is not null `;
        // }

        if (query.county) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and name IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            consistencyByFacilitySql = `${consistencyByFacilitySql} and Agency IN (?)`;
            params.push(query.agency);
        }

        return await this.repository.query(consistencyByFacilitySql, params);
    }
}
