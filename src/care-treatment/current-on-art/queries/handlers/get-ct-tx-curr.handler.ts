import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrQuery } from '../impl/get-ct-tx-curr.query';
import { AggregateTXCurr } from '../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrQuery)
export class GetCtTxCurrHandler implements IQueryHandler<GetCtTxCurrQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>,
    ) {}

    async execute(query: GetCtTxCurrQuery): Promise<any> {
        const txCurr = this.repository
            .createQueryBuilder('f')
            .select(['SUM(CountClientsTXCur) TXCURR'])
            .where('f.[Sex] IS NOT NULL');

        if (query.county) {
            txCurr.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurr.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurr.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurr.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurr.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurr.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurr.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurr.andWhere('f.ageLV < 18');
        }

        if (query.gender) {
            txCurr.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurr.getRawOne();
    }
}
