import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByEntryPointQuery } from '../impl/get-linkage-by-entry-point.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsEntryPoint } from '../../entities/fact-hts-entrypoint.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from '../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageByEntryPointQuery)
export class GetLinkageByEntryPointHandler
    implements IQueryHandler<GetLinkageByEntryPointQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageByEntryPointQuery): Promise<any> {
        const params = [];
        let linkageByEntryPointSql = `SELECT
                EntryPoint entryPoint,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/CAST(SUM(positive)AS FLOAT))*100) AS linkage
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE EntryPoint IS NOT NULL AND EntryPoint <> '' AND positive IS NOT NULL AND positive > 0`;

        if (query.county) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.year) {
        //     linkageByEntryPointSql = `${linkageByEntryPointSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageByEntryPointSql = `${linkageByEntryPointSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and DateTestedKey <= ${query.toDate}01`;
        }

        linkageByEntryPointSql = `${linkageByEntryPointSql} GROUP BY EntryPoint ORDER BY SUM(positive) DESC`;

        return await this.repository.query(linkageByEntryPointSql, params);
    }
}
