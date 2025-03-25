import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfOvcClientsEnrolledInCpimsOverallQuery } from '../impl/get-proportion-of-ovc-clients-enrolled-in-cpims-overall.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetProportionOfOvcClientsEnrolledInCpimsOverallQuery)
export class GetProportionOfOvcClientsEnrolledInCpimsOverallHandler implements IQueryHandler<GetProportionOfOvcClientsEnrolledInCpimsOverallQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetProportionOfOvcClientsEnrolledInCpimsOverallQuery): Promise<any> {
        const enrolledInCIPMS = this.repository.createQueryBuilder('f')
            .select(['EnrolledinCPIMSCleaned EnrolledinCPIMS, Count (*) Enrollments'])
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
            enrolledInCIPMS.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            enrolledInCIPMS.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            enrolledInCIPMS.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            enrolledInCIPMS.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await enrolledInCIPMS
            .groupBy('EnrolledinCPIMSCleaned')
            .getRawMany();
    }
}
