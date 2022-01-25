import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsEnrolledByPartnerQuery } from '../impl/get-otz-adolescents-enrolled-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzAdolescentsEnrolledByPartnerQuery)
export class GetOtzAdolescentsEnrolledByPartnerHandler implements IQueryHandler<GetOtzAdolescentsEnrolledByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzAdolescentsEnrolledByPartnerQuery): Promise<any> {
        const otzEnrollmentsPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner] partner, COUNT(*) totalAdolescents']);

        if (query.county) {
            otzEnrollmentsPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsPartner.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
