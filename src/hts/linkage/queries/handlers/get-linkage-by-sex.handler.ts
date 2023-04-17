import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageBySexQuery } from '../impl/get-linkage-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';
import { FactHTSClientTests } from './../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageBySexQuery)
export class GetLinkageBySexHandler
    implements IQueryHandler<GetLinkageBySexQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageBySexQuery): Promise<any> {
        const params = [];
        let linkageBySexSql = `SELECT
                CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END gender,
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
            WHERE positive > 0 and TestType='Initial Test'`;

        if (query.county) {
            linkageBySexSql = `${linkageBySexSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageBySexSql = `${linkageBySexSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageBySexSql = `${linkageBySexSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageBySexSql = `${linkageBySexSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.year) {
        //     linkageBySexSql = `${linkageBySexSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageBySexSql = `${linkageBySexSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageBySexSql = `${linkageBySexSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageBySexSql = `${linkageBySexSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageBySexSql = `${linkageBySexSql} GROUP BY CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END`;

        return await this.repository.query(linkageBySexSql, params);
    }
}
