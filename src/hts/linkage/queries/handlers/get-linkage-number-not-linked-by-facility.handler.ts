import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberNotLinkedByFacilityQuery } from '../impl/get-linkage-number-not-linked-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetLinkageNumberNotLinkedByFacilityQuery)
export class GetLinkageNumberNotLinkedByFacilityHandler
    implements IQueryHandler<GetLinkageNumberNotLinkedByFacilityQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>,
    ) {}

    async execute(
        query: GetLinkageNumberNotLinkedByFacilityQuery,
    ): Promise<any> {
        const params = [];

        let linkageNumberNotLinkedByFacilitySql =
            'SELECT ' +
            'MFLCode mfl, FacilityName facility, County county, subcounty subCounty, CTPartner partner, Sum(Positive) positive, Sum(Linked) linked ' +
            'FROM fact_htsuptake WHERE MFLCode > 0 AND Positive > 0 ';

        if (query.county) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and subcounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and CTPartner IN (?)`;
            params.push(query.partner);
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
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} GROUP BY MFLCode, FacilityName, County, subcounty, CTPartner`;

        linkageNumberNotLinkedByFacilitySql = `${linkageNumberNotLinkedByFacilitySql} ORDER BY FacilityName`;

        return await this.repository.query(
            linkageNumberNotLinkedByFacilitySql,
            params,
        );
    }
}
