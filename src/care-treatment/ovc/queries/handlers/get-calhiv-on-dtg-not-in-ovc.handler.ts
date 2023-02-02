import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivOnDtgQuery } from '../impl/get-calhiv-on-dtg.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivOnDtgQuery)
export class GetCalhivOnDtgNotInOvcHandler implements IQueryHandler<GetCalhivOnDtgQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetCalhivOnDtgQuery): Promise<any> {
        const CALHIVonDTG = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVonDTG'])
            .andWhere('f.LastRegimen <>\'non DTG\' AND f.OVCEnrollmentDate IS NULL and TXCurr=1');

        if (query.county) {
            CALHIVonDTG.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVonDTG.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVonDTG.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVonDTG.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVonDTG.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVonDTG.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVonDTG.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVonDTG.getRawOne();
    }
}
