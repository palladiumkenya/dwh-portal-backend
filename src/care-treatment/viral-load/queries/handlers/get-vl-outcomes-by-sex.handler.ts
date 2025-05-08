import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOutcomesBySexQuery } from '../impl/get-vl-outcomes-by-sex.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOutcomesBySexQuery)
export class GetVlOutcomesBySexHandler
    implements IQueryHandler<GetVlOutcomesBySexQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetVlOutcomesBySexQuery): Promise<any> {
        const vlOutcomesBySex = this.repository
            .createQueryBuilder('f')
            .select([
                'f.Sex gender, f.ValidVLResultCategory2 outcome, COUNT(f.ValidVLResult) count',
            ])
            .where('f.SiteCode > 0')
            .andWhere('f.isTxCurr > 0')
            .andWhere('f.Sex IS NOT NULL')
            .andWhere('f.ValidVLResultCategory2 IS NOT NULL');

        if (query.county) {
            vlOutcomesBySex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlOutcomesBySex.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlOutcomesBySex.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            vlOutcomesBySex.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlOutcomesBySex.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlOutcomesBySex.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            vlOutcomesBySex.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlOutcomesBySex
            .groupBy('f.Sex, f.ValidVLResultCategory2')
            .orderBy('f.Sex, f.ValidVLResultCategory2')
            .getRawMany();
    }
}
