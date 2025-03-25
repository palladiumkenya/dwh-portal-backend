import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzTotalWithDurableVlQuery } from '../impl/get-otz-total-with-durable-vl.query';
import { AggregateVLDurable } from '../../../viral-load/entities/aggregate-vl-durable.model';

@QueryHandler(GetOtzTotalWithDurableVlQuery)
export class GetOtzTotalWithDurableVlHandler implements IQueryHandler<GetOtzTotalWithDurableVlQuery> {
    constructor(
        @InjectRepository(AggregateVLDurable, 'mssql')
        private readonly repository: Repository<AggregateVLDurable>
    ) {
    }

    async execute(query: GetOtzTotalWithDurableVlQuery): Promise<any> {
        const totalWithDurableLDL = this.repository.createQueryBuilder('f')
            .select(['SUM(CountDurableLDL) totalDurable'])
            .where('f.OtzEnrolled > 0');

        if (query.county) {
            totalWithDurableLDL.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            totalWithDurableLDL.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            totalWithDurableLDL.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            totalWithDurableLDL.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            totalWithDurableLDL.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            totalWithDurableLDL.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            totalWithDurableLDL.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await totalWithDurableLDL.getRawOne();
    }
}
