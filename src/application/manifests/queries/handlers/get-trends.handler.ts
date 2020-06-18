import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { TileDto } from '../../../../entities/manifests/dtos/tile.dto';
import { GetTrendsQuery } from '../get-trends.query';
import { TrendDto } from '../../../../entities/manifests/dtos/trend.dto';


@QueryHandler(GetTrendsQuery)
export class GetTrendsHandler implements IQueryHandler<GetTrendsQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetTrendsQuery): Promise<TrendDto[]> {

        const expectedSql = 'select * from expected_uploads where docket=?';
        const expectedCount = await this.repository.query(expectedSql, [query.docket]);

        const trendsSql = 'select sum(fm.upload) AS trends,dt.year AS year,dt.month AS month,fm.docketId AS docketId\n' +
            'from dim_facility f join fact_manifest fm on f.facilityId = fm.facilityId join dim_time dt on fm.timeId = dt.timeId\n' +
            'where fm.docketId=? and dt.timeId <=? and dt.timeId > DATE_ADD(?, INTERVAL -3 MONTH)\n' +
            'group by dt.year, dt.month, fm.docketId';

        const trends = await this.repository.query(trendsSql, [query.docket, `${query.year}-${query.month}-01`,`${query.year}-${query.month}-01`]);

        const trendDtos: TrendDto[] = [];

        trends.forEach(trend => {
                const trendDto = new TrendDto(query.docket, +expectedCount[0].expected);
                trendDto.setTrend(+trend.trends,+trend.year,+trend.month,trend.monthName);
                trendDtos.push(trendDto);
            },
        );


        return trendDtos;
    }
}
