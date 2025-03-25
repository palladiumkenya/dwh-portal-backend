import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcCaregiversRelationshipToOvcClientQuery } from '../impl/get-ovc-caregivers-relationship-to-ovc-client.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcCaregiversRelationshipToOvcClientQuery)
export class GetOvcCaregiversRelationshipToOvcClientHandler implements IQueryHandler<GetOvcCaregiversRelationshipToOvcClientQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcCaregiversRelationshipToOvcClientQuery): Promise<any> {
        const ovcCareGiversRelationships = this.repository
            .createQueryBuilder('f')
            .select([
                "case when RelationshipWithPatient IS NULL then 'Undocumented' else RelationshipWithPatient end as RelationshipToClient, " +
                    "case when RelationshipWithPatient IS NULL then 'Undocumented' else RelationshipWithPatient end as RelationshipToClientCleaned, " +
                    'COUNT(*) relationships, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage',
            ])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            ovcCareGiversRelationships.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcCareGiversRelationships.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcCareGiversRelationships.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcCareGiversRelationships.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            ovcCareGiversRelationships.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            ovcCareGiversRelationships.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            ovcCareGiversRelationships.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await ovcCareGiversRelationships
            .groupBy('RelationshipWithPatient')
            .getRawMany();
    }
}
