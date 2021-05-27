import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrByFacilityQuery } from '../impl/get-ct-tx-curr-by-facility.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtTxCurrByFacilityQuery)
export class GetCtTxCurrByFacilityHandler implements IQueryHandler<GetCtTxCurrByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
        
    }

    async execute(query: GetCtTxCurrByFacilityQuery): Promise<any> {
        const txCurrByFacility = this.repository.createQueryBuilder('f')
            .select(['MFLCode, ageGroup, SUM(TXCURR_Total) txCurr'])
            .where('f.MFLCode IS NOT NULL');

        if (query.county) {
            txCurrByFacility.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrByFacility.andWhere('Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrByFacility.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txCurrByFacility.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await txCurrByFacility.groupBy('MFLCode, ageGroup').orderBy('MFLCode').getRawMany();
    }
}
