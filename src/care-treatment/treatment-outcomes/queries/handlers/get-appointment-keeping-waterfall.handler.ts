import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAppointmentKeepingWaterfallQuery } from './../impl/get-appointment-keeping-waterfall.query';
import { AggregateAppointments } from './../../entities/aggregate-appointments.model';

@QueryHandler(GetAppointmentKeepingWaterfallQuery)
export class GetAppointmentKeepingWaterfallHandler
    implements IQueryHandler<GetAppointmentKeepingWaterfallQuery> {
    constructor(
        @InjectRepository(AggregateAppointments, 'mssql')
        private readonly repository: Repository<AggregateAppointments>,
    ) {}

    async execute(query: GetAppointmentKeepingWaterfallQuery): Promise<any> {
        const treatmentOutcomes = this.repository
            .createQueryBuilder('f')
            .select([
                'AppointmentStatus, sum(NumOfPatients) NumOfPatients',
            ])

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

        if (query.fromDate) {
            treatmentOutcomes.andWhere('f.AsOfDate >= :fromDate', {
                fromDate: query.fromDate,
            });
        }

        if (query.toDate) {
            treatmentOutcomes.andWhere('f.AsOfDate <= :toDate', {
                toDate: query.toDate,
            });
        }

        return await treatmentOutcomes
            .groupBy('f.AppointmentStatus')
            .getRawMany();
    }
}
