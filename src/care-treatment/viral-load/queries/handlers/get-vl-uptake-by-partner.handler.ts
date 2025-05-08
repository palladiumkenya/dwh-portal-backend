import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlUptakeByPartnerQuery } from '../impl/get-vl-uptake-by-partner.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlUptakeByPartnerQuery)
export class GetVlUptakeByPartnerHandler implements IQueryHandler<GetVlUptakeByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlUptakeByPartnerQuery): Promise<any> {
        const vlUptakeByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                'f.PartnerName partner, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(HasValidVL) vlDone, SUM(VirallySuppressed) suppressed',
            ])
            .where('f.MFLCode > 0')
            .andWhere('f.PartnerName IS NOT NULL');

        if (query.county) {
            vlUptakeByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeByPartner.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlUptakeByPartner.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeByPartner.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeByPartner
            .groupBy('f.PartnerName')
            .orderBy('SUM(f.HasValidVL)', 'DESC')
            .getRawMany();
    }
}
