import { GetUptakeByAgeSexPositivityQuery } from '../impl/get-uptake-by-age-sex-positivity.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByAgeSexPositivityQuery)
export class GetUptakeByAgeSexPositivityHandler
    implements IQueryHandler<GetUptakeByAgeSexPositivityQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByAgeSexPositivityQuery): Promise<any> {

        let uptakeByAgeSex = this.repository
            .createQueryBuilder(`q`)
            .select(`AgeGroup, ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity`)
            .where(`Tested > 0`);

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
            .groupBy(`AgeGroup`)
            .getRawMany();
    }
}
