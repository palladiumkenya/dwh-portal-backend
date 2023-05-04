import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByCountyQuery } from '../impl/get-linkage-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from '../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageByCountyQuery)
export class GetLinkageByCountyHandler
    implements IQueryHandler<GetLinkageByCountyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageByCountyQuery): Promise<any> {
        const params = [];
        let linkageByCountySql = `SELECT
                County,
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
            WHERE County IS NOT NULL AND positive > 0 and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            linkageByCountySql = `${linkageByCountySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageByCountySql = `${linkageByCountySql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageByCountySql = `${linkageByCountySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageByCountySql = `${linkageByCountySql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.year) {
        //     linkageByCountySql = `${linkageByCountySql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageByCountySql = `${linkageByCountySql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageByCountySql = `${linkageByCountySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageByCountySql = `${linkageByCountySql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageByCountySql = `${linkageByCountySql} GROUP BY County ORDER BY SUM(Positive) DESC`;

        return await this.repository.query(linkageByCountySql, params);
    }
}
