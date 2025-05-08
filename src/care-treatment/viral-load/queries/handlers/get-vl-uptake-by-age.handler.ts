import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlUptakeByAgeQuery } from '../impl/get-vl-uptake-by-age.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlUptakeByAgeQuery)
export class GetVlUptakeByAgeHandler implements IQueryHandler<GetVlUptakeByAgeQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlUptakeByAgeQuery): Promise<any> {
        const vlUptakeByAge = this.repository
            .createQueryBuilder('f')
            .select([
                'f.AgeGroup ageGroup, f.Sex gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(HasValidVL) vlDone, SUM(VirallySuppressed) suppressed',
            ])
            .where('f.MFLCode > 0')
            .andWhere('f.AgeGroup IS NOT NULL')
            .andWhere('f.Sex IS NOT NULL');

        if (query.county) {
            vlUptakeByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeByAge.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlUptakeByAge.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeByAge.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeByAge
            .groupBy('f.AgeGroup, f.Sex')
            .orderBy('f.AgeGroup, f.Sex')
            .getRawMany();
    }
}
