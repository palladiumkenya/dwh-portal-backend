import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from '../impl/get-ct-viral-load-cascade-active-art-clients.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetCtViralLoadCascadeActiveArtClientsQuery)
export class GetCtViralLoadCascadeActiveArtClientsHandler implements IQueryHandler<GetCtViralLoadCascadeActiveArtClientsQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetCtViralLoadCascadeActiveArtClientsQuery): Promise<any> {
        const viralLoadCascade = this.repository
            .createQueryBuilder('f')
            .select([
                `SUM([ISTxCurr]) TX_CURR, SUM([Eligible4VL]) Eligible4VL, SUM([HasValidVL]) Last12MonthVL, 
                SUM([ValidVLSup]) Last12MVLSup, SUM([HighViremia]) HighViremia, SUM([LowViremia]) LowViremia, 
                SUM(CASE WHEN ValidVLResultCategory2 = 'High Risk LLV ' THEN 1 END) HighRisk, 
                SUM(CASE WHEN ValidVLResultCategory2 = 'LDL' THEN 1 END) LDL, 
                SUM(CASE WHEN ValidVLResultCategory2 = 'Low Risk LLV' THEN 1 END) LowRisk, 
                SUM(CASE WHEN ValidVLResultCategory2 = 'UNSUPPRESSED' THEN 1 END) Unsuppressed,
                EndofMonthDate
                `,
            ])
            .where('f.[ISTxCurr] > 0');

        if (query.county) {
            viralLoadCascade
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralLoadCascade
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralLoadCascade
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            viralLoadCascade
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            viralLoadCascade.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            viralLoadCascade.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            viralLoadCascade.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await viralLoadCascade
            .groupBy('EndofMonthDate')
            .getRawOne();
    }
}
