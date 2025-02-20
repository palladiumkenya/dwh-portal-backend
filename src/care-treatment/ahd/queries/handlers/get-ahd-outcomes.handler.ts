import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';
import { GetAhdOutcomesQuery } from '../impl/get-ahd-outcomes.query';

@QueryHandler(GetAhdOutcomesQuery)
export class GetAhdOutcomesHandler implements IQueryHandler<GetAhdOutcomesQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetAhdOutcomesQuery): Promise<any> {
        const ahdAssessment = this.repository
            .createQueryBuilder('f')
            .select([`
                ARTOutcomeDescription,
                Count (*) as AHDOutcomes
            `])
            .where('AHD=1')
            .andWhere("ARTOutcomeDescription NOT IN ('Others', 'LOST IN HMIS', 'NEW PATIENT')")
            .andWhere("(IsRTTLast12MonthsAfter3monthsIIT=1 OR ConfirmedTreatmentFailure=1 OR NewPatient=1)")

        if (query.county) {
            ahdAssessment.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            ahdAssessment.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            ahdAssessment.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            ahdAssessment.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            ahdAssessment.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            ahdAssessment.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            ahdAssessment.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await ahdAssessment
            .groupBy('ARTOutcomeDescription')
            .getRawMany();
    }
}
