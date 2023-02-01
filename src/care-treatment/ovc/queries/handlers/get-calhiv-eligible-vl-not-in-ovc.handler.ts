import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivEligibleVlQuery } from '../impl/get-calhiv-eligible-vl.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivEligibleVlQuery)
export class GetCalhivEligibleVlNotInOvcHandler
    implements IQueryHandler<GetCalhivEligibleVlQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>,
    ) {}

    async execute(query: GetCalhivEligibleVlQuery): Promise<any> {
        const CALHIVEligible = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVEligible'])
            .andWhere(
                'f.TXCurr=1 and EligibleVL=1 and f.OVCEnrollmentDate IS NULL',
            );

        if (query.county) {
            CALHIVEligible.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            CALHIVEligible.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            CALHIVEligible.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            CALHIVEligible.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            CALHIVEligible.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            CALHIVEligible.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            CALHIVEligible.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        return await CALHIVEligible.getRawOne();
    }
}
