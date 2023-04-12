import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AggregateAppointments } from '../../entities/aggregate-appointments.model';
import { GetQuaterlyIITQuery } from './../impl/get-quaterly-iit.query';

@QueryHandler(GetQuaterlyIITQuery)
export class GetQuaterlyIITHandler
    implements IQueryHandler<GetQuaterlyIITQuery> {
    constructor(
        @InjectRepository(AggregateAppointments, 'mssql')
        private readonly repository: Repository<AggregateAppointments>,
    ) {}

    async execute(query: GetQuaterlyIITQuery): Promise<any> {
        const treatmentOutcomes = this.repository
            .createQueryBuilder('f')
            .select([
                'YEAR(AsOfDate) AS year, DATEPART(quarter, AsOfDate) AS quarter, sum(NumOfPatients) NumOfPatients',
            ]);

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
            treatmentOutcomes.andWhere('YEAR(f.AsOfDate) = :year', {
                year: query.year,
            });
        }

        if (query.month) {
            treatmentOutcomes.andWhere('MONTH(f.AsOfDate) = :month', {
                month: query.month,
            });
        }

        return await treatmentOutcomes
            .groupBy('YEAR(AsOfDate), DATEPART(quarter, AsOfDate)')
            .orderBy('YEAR(AsOfDate)', 'DESC')
            .addOrderBy('DATEPART(quarter, AsOfDate)', 'DESC')
            .getRawMany();
    }
}
