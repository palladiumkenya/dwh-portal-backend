import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByAgeSexQuery } from '../impl/get-uptake-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByAgeSexQuery)
export class GetUptakeByAgeSexHandler
    implements IQueryHandler<GetUptakeByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByAgeSexQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSex = this.repository
            .createQueryBuilder(`q`)
            .select(`AgeGroup, Gender, SUM(Tested) Tested`)
            .where(`Tested is not null`);

        if (query.county) {
            uptakeByAgeSex.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByAgeSex.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            uptakeByAgeSex.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }


        if (query.partner) {
            uptakeByAgeSex.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }


        if (query.fromDate) {
            let year = `${query.fromDate}`.substring(0, 4);
            let month = `${query.fromDate}`.substring(4, 6);
            let formattedDate = `${year}-${month}-01`;
            uptakeByAgeSex.andWhere('AsOfDate >= :fromDate', { fromDate: formattedDate });
        }

        if (query.toDate) {
            let toDate = `${query.toDate}`;
            let year = toDate.substring(0, 4);
            let month = toDate.substring(4, 6);
            let formattedDate = `${year}-${month}-01`;
            uptakeByAgeSex.andWhere('AsOfDate <=  EOMONTH(:toDate)', { toDate: formattedDate });
        }

        return await uptakeByAgeSex
            .groupBy(`AgeGroup, Gender`)
            .getRawMany();
    }
}
