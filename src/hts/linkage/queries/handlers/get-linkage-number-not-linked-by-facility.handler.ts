import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberNotLinkedByFacilityQuery } from '../impl/get-linkage-number-not-linked-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetLinkageNumberNotLinkedByFacilityQuery)
export class GetLinkageNumberNotLinkedByFacilityHandler
    implements IQueryHandler<GetLinkageNumberNotLinkedByFacilityQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(
        query: GetLinkageNumberNotLinkedByFacilityQuery,
    ): Promise<any> {
        const params = [];

        let linkageNumberNotLinkedByFacilitySql = this.repository.createQueryBuilder('f')
            .select([`
                MFLCode mfl, 
                FacilityName facility, 
                County county, 
                subcounty subCounty, 
                PartnerName partner, 
                Sum(Positive) positive, 
                Sum(Linked) linked
            `])
            .where(`MFLCode > 0 AND Positive > 0`);

        if (query.county) {
            linkageNumberNotLinkedByFacilitySql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageNumberNotLinkedByFacilitySql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageNumberNotLinkedByFacilitySql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageNumberNotLinkedByFacilitySql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageNumberNotLinkedByFacilitySql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageNumberNotLinkedByFacilitySql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageNumberNotLinkedByFacilitySql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageNumberNotLinkedByFacilitySql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageNumberNotLinkedByFacilitySql
            .groupBy(`MFLCode, FacilityName, County, subcounty, PartnerName`)
            .orderBy('FacilityName')
            .getRawMany()
    }
}
