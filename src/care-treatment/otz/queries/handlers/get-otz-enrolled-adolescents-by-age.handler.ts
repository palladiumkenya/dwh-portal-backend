import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrolledAdolescentsByAgeQuery } from '../impl/get-otz-enrolled-adolescents-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzEnrolledAdolescentsByAgeQuery)
export class GetOtzEnrolledAdolescentsByAgeHandler implements IQueryHandler<GetOtzEnrolledAdolescentsByAgeQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrolledAdolescentsByAgeQuery): Promise<any> {
        const otzTotalAdolescentsByAgeGroup = this.repository.createQueryBuilder('f')
            .select(['count(*) totalAdolescents, DATIM_AgeGroup ageGroup']);

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
            otzTotalAdolescentsByAgeGroup.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzTotalAdolescentsByAgeGroup.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzTotalAdolescentsByAgeGroup
            .groupBy('[DATIM_AgeGroup]')
            .orderBy('[DATIM_AgeGroup]')
            .getRawMany();
    }
}
