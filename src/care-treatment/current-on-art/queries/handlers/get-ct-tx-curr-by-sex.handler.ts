import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrBySexQuery } from '../impl/get-ct-tx-curr-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateTXCurr } from '../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrBySexQuery)
export class GetCtTxCurrBySexHandler
    implements IQueryHandler<GetCtTxCurrBySexQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>,
    ) {}

    async execute(query: GetCtTxCurrBySexQuery): Promise<any> {
        const txCurrBySex = this.repository
            .createQueryBuilder('f')
            .select(['[Sex], SUM([CountClientsTXCur]) txCurr'])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            .where('f.[Sex] IS NOT NULL');

        if (query.county) {
            txCurrBySex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrBySex.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrBySex.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrBySex.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrBySex.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrBySex.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrBySex.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrBySex
            .groupBy('[Sex]')
            .orderBy('[Sex]')
            .getRawMany();
    }
}
