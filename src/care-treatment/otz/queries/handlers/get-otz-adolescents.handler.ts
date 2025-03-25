import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsQuery } from '../impl/get-otz-adolescents.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzAdolescentsQuery)
export class GetOtzAdolescentsHandler
    implements IQueryHandler<GetOtzAdolescentsQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(query: GetOtzAdolescentsQuery): Promise<any> {
        const otzTotalAdolescents = this.repository
            .createQueryBuilder('f')
            .select(['count(*) totalAdolescents, Sex Gender']);

        if (query.county) {
            otzTotalAdolescents.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            otzTotalAdolescents.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            otzTotalAdolescents.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            otzTotalAdolescents.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            otzTotalAdolescents.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            otzTotalAdolescents.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            otzTotalAdolescents.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzTotalAdolescents
            .groupBy('Sex')
            .orderBy('Sex')
            .getRawMany();
    }
}
