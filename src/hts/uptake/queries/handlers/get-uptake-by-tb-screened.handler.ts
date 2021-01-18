import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreenedQuery } from '../impl/get-uptake-by-tb-screened.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTBScreening } from '../../entities/fact-hts-tbscreening.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByTbScreenedQuery)
export class GetUptakeByTbScreenedHandler implements IQueryHandler<GetUptakeByTbScreenedQuery> {
    constructor(
        @InjectRepository(FactHtsTBScreening)
        private readonly repository: Repository<FactHtsTBScreening>
    ) {
    }

    async execute(query: GetUptakeByTbScreenedQuery): Promise<any> {
        const params = [];
        let uptakeByTBScreenedSql = 'SELECT TBSCreening_grp, SUM(Tested)Tested, SUM(Positive) Positive, SUM(Linked) Linked FROM fact_hts_tbscreening where TBSCreening_grp is not null ';

        if(query.county) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and subcounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and year=?`;
            params.push(query.year);
        }

        uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} GROUP BY TBSCreening_grp`;

        return  await this.repository.query(uptakeByTBScreenedSql, params);
    }
}
