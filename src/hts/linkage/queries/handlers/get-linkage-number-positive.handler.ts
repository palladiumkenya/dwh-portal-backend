import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetLinkageNumberPositiveQuery} from '../impl/get-linkage-number-positive.query';
import {InjectRepository} from '@nestjs/typeorm';
import {FactHtsUptake} from '../../entities/fact-htsuptake.entity';
import {Repository} from 'typeorm';
import { FactHTSClientTests } from './../../entities/fact-hts-client-tests.model';


@QueryHandler(GetLinkageNumberPositiveQuery)
export class GetLinkageNumberPositiveHandler
    implements IQueryHandler<GetLinkageNumberPositiveQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageNumberPositiveQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveSql = `SELECT
                year(DateTestedKey) year, month(DateTestedKey) month,
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
            WHERE positive > 0 and TestType='Initial Test'`;

        if (query.county) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if (query.year) {

        //     linkageNumberPositiveSql = `${linkageNumberPositiveSql} and year=?`;
        //     params.push(query.year);

        // }

        // if (query.month) {
        //     linkageNumberPositiveSql = `${linkageNumberPositiveSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageNumberPositiveSql = `${linkageNumberPositiveSql} GROUP BY year(DateTestedKey), month(DateTestedKey) ORDER BY year(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(linkageNumberPositiveSql, params);
    }
}
