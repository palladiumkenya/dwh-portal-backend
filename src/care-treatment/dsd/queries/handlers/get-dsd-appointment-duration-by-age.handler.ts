import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByAgeQuery } from '../impl/get-dsd-appointment-duration-by-age.query';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';

@QueryHandler(GetDsdAppointmentDurationByAgeQuery)
export class GetDsdAppointmentDurationByAgeHandler implements IQueryHandler<GetDsdAppointmentDurationByAgeQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdUptake, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdUptake>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByAgeQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(MMD) MMD, SUM(NonMMD) NonMMD, DATIM_AgeGroup AgeGroup'])
            .where('f.MFLCode > 1');

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
            dsdAppointmentDuration.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdAppointmentDuration
            .groupBy('DATIM_AgeGroup')
            .orderBy('DATIM_AgeGroup')
            .getRawMany();
    }
}
