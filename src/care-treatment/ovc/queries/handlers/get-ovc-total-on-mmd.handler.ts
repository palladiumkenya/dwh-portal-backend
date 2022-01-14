import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcTotalOnMmdQuery } from '../impl/get-ovc-total-on-mmd.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcTotalOnMmdQuery)
export class GetOvcTotalOnMmdHandler implements IQueryHandler<GetOvcTotalOnMmdQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcTotalOnMmdQuery): Promise<any> {
        const ovcTotalOnMmd = this.repository.createQueryBuilder('f')
            .select(['Count (*)ovcTotalOnMmd'])
            .andWhere('f.onMMD=1 and f.OVCEnrollmentDate IS NOT NULL and f.TXCurr=1');

        if (query.county) {
            ovcTotalOnMmd.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcTotalOnMmd.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcTotalOnMmd.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcTotalOnMmd.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            ovcTotalOnMmd.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            ovcTotalOnMmd.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            ovcTotalOnMmd.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await ovcTotalOnMmd.getRawOne();
    }
}
