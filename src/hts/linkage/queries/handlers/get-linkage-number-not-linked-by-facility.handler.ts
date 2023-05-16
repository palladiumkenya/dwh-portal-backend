import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberNotLinkedByFacilityQuery } from '../impl/get-linkage-number-not-linked-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from '../../entities/fact-hts-client-tests.model';

@QueryHandler(GetLinkageNumberNotLinkedByFacilityQuery)
export class GetLinkageNumberNotLinkedByFacilityHandler
    implements IQueryHandler<GetLinkageNumberNotLinkedByFacilityQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(
        query: GetLinkageNumberNotLinkedByFacilityQuery,
    ): Promise<any> {
        const params = [];

        let linkageNumberNotLinkedByFacilitySql = `SELECT
                MFLCode mfl, 
                FacilityName facility, 
                County county, 
                subcounty subCounty, 
                PartnerName partner, 
                Sum(Positive) positive, 
                Sum(Linked) linked 
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                left JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE  MFLCode > 0 AND Positive > 0 and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and subcounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        // if (query.year) {
        //     // if (query.year == new Date().getFullYear()) {
        //     //     linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
        //     // } else {
        //         linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and year=?`;
        //     // }
        //     params.push(query.year);
        // }

        // if (query.month) {
        //     linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} GROUP BY MFLCode, FacilityName, County, subcounty, PartnerName`;

        linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} ORDER BY FacilityName`;

        return await this.repository.query(
            linkageNumberNotLinkedByFacilitySql,
            params,
        );
    }
}
