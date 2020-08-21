import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreenedQuery } from '../get-uptake-by-tb-screened.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTBScreening } from '../../../../entities/hts/fact-hts-tbscreening.entity';
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
        let uptakeByTBScreenedSql = 'SELECT SUM(CASE \n' +
            '             WHEN t.`tbScreening` IS NULL THEN 1\n' +
            '             ELSE 0\n' +
            '           END) AS NotScreenedTB,\n' +
            '       SUM(CASE \n' +
            '             WHEN t.`tbScreening` IS NOT NULL THEN 1\n' +
            '             ELSE 0\n' +
            '           END) AS ScreenedTB\n' +
            '  FROM `fact_hts_tbscreening` t WHERE `tbScreening` IS NULL OR `tbScreening` IS NOT NULL ';

        if(query.county) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and County=?`;
            params.push(query.county);
        }

        if(query.month) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and FacilityName=?`;
            params.push(query.facility);
        }

        return  await this.repository.query(uptakeByTBScreenedSql, params);
    }
}
