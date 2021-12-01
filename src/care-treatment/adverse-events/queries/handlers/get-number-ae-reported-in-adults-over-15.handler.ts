import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { GetNumberAeReportedInAdultsOver15Query } from '../impl/get-number-ae-reported-in-adults-over-15.query';

@QueryHandler(GetNumberAeReportedInAdultsOver15Query)
export class GetNumberAeReportedInAdultsOver15Handler implements IQueryHandler<GetNumberAeReportedInAdultsOver15Query> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetNumberAeReportedInAdultsOver15Query): Promise<any> {
        const noOfReportedAeinAdults = this.repository.createQueryBuilder('f')
            .select('SUM([AdverseEvent_Total]) total')
            .where('[AgeGroup] NOT IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

        if (query.county) {
            noOfReportedAeinAdults
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            noOfReportedAeinAdults
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            noOfReportedAeinAdults
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            noOfReportedAeinAdults
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfReportedAeinAdults.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            noOfReportedAeinAdults.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfReportedAeinAdults.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfReportedAeinAdults.getRawOne();
    }
}
