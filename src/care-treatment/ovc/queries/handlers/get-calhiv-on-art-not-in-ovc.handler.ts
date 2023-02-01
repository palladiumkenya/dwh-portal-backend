import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GetCalhivOnArtNotInOvcQuery} from "../impl/get-calhiv-on-art-not-in-ovc.query";
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivOnArtNotInOvcQuery)
export class GetCalhivOnArtNotInOvcHandler
    implements IQueryHandler<GetCalhivOnArtNotInOvcQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>,
    ) {}

    async execute(query: GetCalhivOnArtNotInOvcQuery): Promise<any> {
        const CALHIVonARTNotInOvc = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVonART'])
            .andWhere('f.TXCurr=1 AND f.OVCEnrollmentDate IS NULL');

        if (query.county) {
            CALHIVonARTNotInOvc.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            CALHIVonARTNotInOvc.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            CALHIVonARTNotInOvc.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            CALHIVonARTNotInOvc.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            CALHIVonARTNotInOvc.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            CALHIVonARTNotInOvc.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            CALHIVonARTNotInOvc.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await CALHIVonARTNotInOvc.getRawOne();
    }
}
