import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberPositiveByTypeQuery } from '../impl/get-linkage-number-positive-by-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from '../../entities/fact-hts-client-tests.model';


@QueryHandler(GetLinkageNumberPositiveByTypeQuery)
export class GetLinkageNumberPositiveByTypeHandler
    implements IQueryHandler<GetLinkageNumberPositiveByTypeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetLinkageNumberPositiveByTypeQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveByTypeSql = `SELECT
                year(DateTestedKey) year, month(DateTestedKey) month, TestedBefore,
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
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if(query.year) {
        //     if(query.year == (new Date()).getFullYear()) {
        //         linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
        //     } else {
        //         linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and year=?`;
        //     }
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} GROUP BY TestedBefore, year(DateTestedKey), month(DateTestedKey)`;

        linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} ORDER BY TestedBefore, year(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(
            linkageNumberPositiveByTypeSql,
            params,
        );
    }
}
