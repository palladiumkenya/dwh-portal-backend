import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlUptakeUToUQuery } from '../impl/get-vl-uptake-U-to-U.query';
import { AggregateVLDurable } from './../../entities/aggregate-vl-durable.model';

@QueryHandler(GetVlUptakeUToUQuery)
export class GetVlUptakeUToUHandler
    implements IQueryHandler<GetVlUptakeUToUQuery> {
    constructor(
        @InjectRepository(AggregateVLDurable, 'mssql')
        private readonly repository: Repository<AggregateVLDurable>,
    ) {}

    async execute(query: GetVlUptakeUToUQuery): Promise<any> {
        const vlUptake = this.repository
            .createQueryBuilder('f')
            .select([
                `SUM(TXCurr) TXCurr, SUM(EligibleVL) EligibleVL, SUM(HasValidVL) HasValidVL, 
                SUM(CountTwoConsecutiveTestsWithinTheYear) TwoConsTests, 
                SUM(CountEligibleForTwoVLTests) TwoEligibleTests, SUM(CountDurableLDL) DurableLDL,
                SUM(CountLDLLastOneTest) LDLLastOneTest`,
            ])
            .where('f.Gender IS NOT NULL');

        if (query.county) {
            vlUptake.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            
            });
        }

        if (query.subCounty) {
            vlUptake.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlUptake.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            vlUptake.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlUptake.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlUptake.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            vlUptake.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.pbfw) {
            vlUptake.andWhere('f.PBFWCategory IN (:...pbfws)', {
                pbfws: query.pbfw,
            });
        }

        return await vlUptake.getRawOne();
    }
}
