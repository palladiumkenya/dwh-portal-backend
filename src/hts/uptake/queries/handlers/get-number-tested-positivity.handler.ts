import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../impl/get-number-tested-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';


@QueryHandler(GetNumberTestedPositivityQuery)
export class GetNumberTestedPositivityHandler
    implements IQueryHandler<GetNumberTestedPositivityQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetNumberTestedPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = `SELECT
                year(DateTestedKey) year, month(DateTestedKey) month, TestedBefore,
                SUM(Tested) Tested,
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
            WHERE positive > 0`;

        if (query.county) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and PartnerName IN (?)`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     numberTestedPositivitySql = `${numberTestedPositivitySql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     const dateVal = new Date();
        //     const yearVal = dateVal.getFullYear();

        //     if(query.year == yearVal) {
        //         numberTestedPositivitySql = `${numberTestedPositivitySql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
        //     } else {
        //         numberTestedPositivitySql = `${numberTestedPositivitySql} and year=?`;
        //     }

        //     params.push(query.year);
        // }

        if (query.fromDate) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        numberTestedPositivitySql = `${numberTestedPositivitySql} GROUP BY TestedBefore, year(DateTestedKey), month(DateTestedKey)`;

        numberTestedPositivitySql = `${numberTestedPositivitySql} ORDER BY TestedBefore, year(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(numberTestedPositivitySql, params);
    }
}
