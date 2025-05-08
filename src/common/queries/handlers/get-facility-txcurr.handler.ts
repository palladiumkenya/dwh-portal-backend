import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetFacilityTxcurrQuery } from '../impl/get-facility-txcurr.query';
import { LinelistFACTART } from '../../../care-treatment/common/entities/linelist-fact-art.model';

@QueryHandler(GetFacilityTxcurrQuery)
export class GetFacilityTxcurrHandler implements IQueryHandler<GetFacilityTxcurrQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetFacilityTxcurrQuery): Promise<any> {
        const facilities = this.repository
            .createQueryBuilder('q')
            .select('count (*) TxCurr, KEPH_Level')
            .leftJoin('all_EMRSites', 'e', 'e.MFLCode = q.SiteCode')
            .where(`ARTOutcomeDescription='Active'`);

        if (query.county) {
            facilities.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilities.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }


        return await facilities
            .groupBy('KEPH_Level')
            .getRawMany();
    }
}
