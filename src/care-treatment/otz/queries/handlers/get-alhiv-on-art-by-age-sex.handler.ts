import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';
import { GetAlhivOnArtByAgeSexQuery } from '../impl/get-alhiv-on-art-by-age-sex.query';

@QueryHandler(GetAlhivOnArtByAgeSexQuery)
export class GetAlhivOnArtByAgeSexHandler
    implements IQueryHandler<GetAlhivOnArtByAgeSexQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(query: GetAlhivOnArtByAgeSexQuery): Promise<any> {
        const CALHIVOnART = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVonART, AgeGroup, Sex Gender']);

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

        return await CALHIVOnART.groupBy('AgeGroup, Sex').getRawMany();
    }
}
