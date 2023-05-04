import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByStrategyQuery } from '../impl/get-linkage-by-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTeststrategy } from '../../entities/fact-hts-teststrategy.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageByStrategyQuery)
export class GetLinkageByStrategyHandler
    implements IQueryHandler<GetLinkageByStrategyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageByStrategyQuery): Promise<any> {
        const params = [];
        let linkageByStrategySql = `SELECT
                CASE WHEN TestStrategy = 'NP: HTS for non-patients ' THEN 'NP:HTS for Non-Patient' ELSE TestStrategy END AS TestStrategy,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/CAST(SUM(positive)AS FLOAT))*100) AS linkage
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                left JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE TestStrategy IS NOT NULL AND TestStrategy <> 'NULL' AND positive > 0 and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            linkageByStrategySql = `${linkageByStrategySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageByStrategySql = `${linkageByStrategySql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageByStrategySql = `${linkageByStrategySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageByStrategySql = `${linkageByStrategySql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.month) {
        //     linkageByStrategySql = `${linkageByStrategySql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     linkageByStrategySql = `${linkageByStrategySql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            linkageByStrategySql = `${linkageByStrategySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageByStrategySql = `${linkageByStrategySql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageByStrategySql = `${linkageByStrategySql} GROUP BY TestStrategy ORDER BY SUM(positive) DESC`;

        return await this.repository.query(linkageByStrategySql, params);
    }
}
