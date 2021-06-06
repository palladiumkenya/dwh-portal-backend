import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery } from '../impl/get-proportion-of-ovc-clients-enrolled-in-cpims-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery)
export class GetProportionOfOvcClientsEnrolledInCpimsByGenderHandler implements IQueryHandler<GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery): Promise<any> {
        const enrolledInCIPMS = this.repository.createQueryBuilder('f')
            .select(['[EnrolledinCPIMS], COUNT(*) Enrollments, Gender'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            enrolledInCIPMS.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            enrolledInCIPMS.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            enrolledInCIPMS.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            enrolledInCIPMS.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await enrolledInCIPMS
            .groupBy('EnrolledinCPIMS, Gender')
            .getRawMany();
    }
}