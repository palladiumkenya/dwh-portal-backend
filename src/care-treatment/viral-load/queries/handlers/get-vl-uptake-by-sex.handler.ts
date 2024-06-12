import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlUptakeBySexQuery } from '../impl/get-vl-uptake-by-sex.query';
import { AggregateVLUptakeOutcome } from './../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlUptakeBySexQuery)
export class GetVlUptakeBySexHandler implements IQueryHandler<GetVlUptakeBySexQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlUptakeBySexQuery): Promise<any> {
        const vlUptakeBySex = this.repository
            .createQueryBuilder('f')
            .select([
                'Gender gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(HasValidVL) vlDone, SUM(VirallySuppressed) suppressed',
            ])
            .where('f.MFLCode > 0')
            .andWhere('f.Gender IS NOT NULL');

        if (query.county) {
            vlUptakeBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeBySex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlUptakeBySex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeBySex
            .groupBy('f.Gender')
            .getRawMany();
    }
}
