import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByAgeQuery } from '../impl/get-dsd-appointment-duration-by-age.query';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';
import {AggregateDSD} from "../../entities/aggregate-dsd.model";
import {DimAgeGroups} from "../../../common/entities/dim-age-groups.model";

@QueryHandler(GetDsdAppointmentDurationByAgeQuery)
export class GetDsdAppointmentDurationByAgeHandler implements IQueryHandler<GetDsdAppointmentDurationByAgeQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByAgeQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(f.patients_onMMD) MMD, SUM(f.patients_nonMMD) NonMMD, f.AgeGroup'])
            .where('f.MFLCode > 1')
                .groupBy('f.MFLCode,f.AgeGroup')
            // .innerJoin(AggregateDSD, 'df', 'df.MFLCode = f.MFLCode')
        ;

        if (query.county) {
            dsdAppointmentDuration.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdAppointmentDuration.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdAppointmentDuration.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdAppointmentDuration.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentDuration.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.ageGroup) {
            dsdAppointmentDuration.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        if (query.gender) {
            dsdAppointmentDuration.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdAppointmentDuration
            .groupBy('AgeGroup')
            .orderBy('AgeGroup')
            .getRawMany();
    }
}
