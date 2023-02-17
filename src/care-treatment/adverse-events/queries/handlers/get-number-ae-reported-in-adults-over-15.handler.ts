import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNumberAeReportedInAdultsOver15Query } from '../impl/get-number-ae-reported-in-adults-over-15.query';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetNumberAeReportedInAdultsOver15Query)
export class GetNumberAeReportedInAdultsOver15Handler implements IQueryHandler<GetNumberAeReportedInAdultsOver15Query> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetNumberAeReportedInAdultsOver15Query): Promise<any> {
        const noOfReportedAeinAdults = this.repository
            .createQueryBuilder('f')
            .select('SUM([AdverseEventCount]) total')
            .where(
                "[DATIMAgeGroup] NOT IN ('Under 1', '1 to 4', '5 to 9', '10 to 14')",
            );

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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfReportedAeinAdults.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            noOfReportedAeinAdults.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfReportedAeinAdults.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfReportedAeinAdults.getRawOne();
    }
}
