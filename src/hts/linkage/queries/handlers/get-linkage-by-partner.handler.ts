import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByPartnerQuery } from '../impl/get-linkage-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageByPartnerQuery)
export class GetLinkageByPartnerHandler
    implements IQueryHandler<GetLinkageByPartnerQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageByPartnerQuery): Promise<any> {
        const params = [];
        let linkageByPartnerSql = `SELECT
                PartnerName Partner,
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
            WHERE PartnerName IS NOT NULL AND positive > 0`;

        if (query.county) {
            linkageByPartnerSql = `${linkageByPartnerSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageByPartnerSql = `${linkageByPartnerSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageByPartnerSql = `${linkageByPartnerSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageByPartnerSql = `${linkageByPartnerSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.year) {
        //     linkageByPartnerSql = `${linkageByPartnerSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageByPartnerSql = `${linkageByPartnerSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageByPartnerSql = `${linkageByPartnerSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageByPartnerSql = `${linkageByPartnerSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageByPartnerSql = `${linkageByPartnerSql} GROUP BY PartnerName ORDER BY SUM(Positive) DESC`;

        return await this.repository.query(linkageByPartnerSql, params);
    }
}
