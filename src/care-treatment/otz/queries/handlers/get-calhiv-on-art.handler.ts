import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOTZCalhivOnArtQuery } from '../impl/get-calhiv-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOTZCalhivOnArtQuery)
export class GetOTZCalhivOnArtHandler
    implements IQueryHandler<GetOTZCalhivOnArtQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(query: GetOTZCalhivOnArtQuery): Promise<any> {
        const CALHIVOnART = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVonART']);

        if (query.county) {
            CALHIVOnART.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            CALHIVOnART.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            CALHIVOnART.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            CALHIVOnART.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            CALHIVOnART.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            CALHIVOnART.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            CALHIVOnART.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await CALHIVOnART.getRawOne();
    }
}
