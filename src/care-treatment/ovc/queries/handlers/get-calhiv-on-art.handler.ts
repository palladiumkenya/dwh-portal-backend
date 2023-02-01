import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivOnArtQuery } from '../impl/get-calhiv-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivOnArtQuery)
export class GetCalhivOnArtHandler
    implements IQueryHandler<GetCalhivOnArtQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>,
    ) {}

    async execute(query: GetCalhivOnArtQuery): Promise<any> {
        const CALHIVonART = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVonART'])
            .andWhere('f.TXCurr=1');

        if (query.county) {
            CALHIVonART.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            CALHIVonART.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            CALHIVonART.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            CALHIVonART.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            CALHIVonART.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            CALHIVonART.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            CALHIVonART.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        return await CALHIVonART.getRawOne();
    }
}
