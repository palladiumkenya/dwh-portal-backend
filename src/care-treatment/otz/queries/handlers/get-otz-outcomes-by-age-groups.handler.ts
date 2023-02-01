import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByAgeGroupsQuery } from '../impl/get-otz-outcomes-by-age-groups.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOTZOutcome } from './../../entities/aggregate-otz-outcome.model';

@QueryHandler(GetOtzOutcomesByAgeGroupsQuery)
export class GetOtzOutcomesByAgeGroupsHandler implements IQueryHandler<GetOtzOutcomesByAgeGroupsQuery> {
    constructor(
        @InjectRepository(AggregateOTZOutcome, 'mssql')
        private readonly repository: Repository<AggregateOTZOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByAgeGroupsQuery): Promise<any> {
        const otzOutcomesByAgeGroups = this.repository
            .createQueryBuilder('f')
            .select([
                "AgeGroup, CASE WHEN [Outcome] IS NULL THEN 'Active' WHEN [Outcome] = 'Died' THEN 'Dead' ELSE [Outcome] END as Outcome, SUM(patients_totalOutcome) outcomesByAgeGroup",
            ]);

        if (query.county) {
            otzOutcomesByAgeGroups.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByAgeGroups.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByAgeGroups.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByAgeGroups.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByAgeGroups.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            otzOutcomesByAgeGroups.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            otzOutcomesByAgeGroups.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await otzOutcomesByAgeGroups
            .groupBy('[AgeGroup], CASE WHEN [Outcome] IS NULL THEN \'Active\' WHEN [Outcome] = \'Died\' THEN \'Dead\' ELSE [Outcome] END')
            .getRawMany();
    }
}
