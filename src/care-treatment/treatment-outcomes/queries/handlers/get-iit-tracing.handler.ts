import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetIITTracingQuery } from '../impl/get-iit-tracing.query';
import { AggregateDefaulterTracingOutcome } from '../../entities/aggregate-defaulter-tracing-outcome.model';

@QueryHandler(GetIITTracingQuery)
export class GetIITTracingHandler
    implements IQueryHandler<GetIITTracingQuery> {
    constructor(
        @InjectRepository(AggregateDefaulterTracingOutcome, 'mssql')
        private readonly repository: Repository<
            AggregateDefaulterTracingOutcome
        >,
    ) {}

    async execute(query: GetIITTracingQuery): Promise<any> {
        const treatmentOutcomes = this.repository
            .createQueryBuilder('f')
            .select([
                'SUM(patients) patients, Year, Month, TracingOutcome',
            ])
            .where(`TracingOutcome IN ('Contact', 'no contact')`);

        if (query.county) {
            treatmentOutcomes.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            treatmentOutcomes.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            treatmentOutcomes.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            treatmentOutcomes.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            treatmentOutcomes.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            treatmentOutcomes.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            treatmentOutcomes.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.year) {
            treatmentOutcomes.andWhere('YEAR = :year', {
                year: query.year,
            });
        }

        if (query.month) {
            treatmentOutcomes.andWhere('MONTH = :month', {
                month: query.month,
            });
        }

        return await treatmentOutcomes
            .groupBy('Year, Month, TracingOutcome')
            .getRawMany();
    }
}
