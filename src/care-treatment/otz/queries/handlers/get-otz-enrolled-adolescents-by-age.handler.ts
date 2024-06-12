import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrolledAdolescentsByAgeQuery } from '../impl/get-otz-enrolled-adolescents-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzEnrolledAdolescentsByAgeQuery)
export class GetOtzEnrolledAdolescentsByAgeHandler implements IQueryHandler<GetOtzEnrolledAdolescentsByAgeQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrolledAdolescentsByAgeQuery): Promise<any> {
        const otzTotalAdolescentsByAgeGroup = this.repository.createQueryBuilder('f')
            .select(['Sum(Eligible) totalAdolescents, AgeGroup ageGroup']);
        if (query.county) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzTotalAdolescentsByAgeGroup
            .groupBy('[AgeGroup]')
            .orderBy('[AgeGroup]')
            .getRawMany();
    }
}
