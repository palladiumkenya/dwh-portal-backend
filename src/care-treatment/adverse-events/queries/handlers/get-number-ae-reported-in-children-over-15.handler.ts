import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { GetNumberAeReportedInChildrenOver15Query } from '../impl/get-number-ae-reported-in-children-over-15.query';

@QueryHandler(GetNumberAeReportedInChildrenOver15Query)
export class GetNumberAeReportedInChildrenOver15Handler implements IQueryHandler<GetNumberAeReportedInChildrenOver15Query> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetNumberAeReportedInChildrenOver15Query): Promise<any> {
        const noOfReportedAeinChildren = this.repository.createQueryBuilder('f')
            .select('SUM([AdverseEvent_Total]) total')
            .where('[AgeGroup] IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

        if (query.county) {
            noOfReportedAeinChildren
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            noOfReportedAeinChildren
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            noOfReportedAeinChildren
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            noOfReportedAeinChildren
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfReportedAeinChildren.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            noOfReportedAeinChildren.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfReportedAeinChildren.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfReportedAeinChildren.getRawOne();
    }
}
