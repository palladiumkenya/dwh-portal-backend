import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTilesQuery } from '../get-tiles.query';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { TileDto } from '../../../../entities/manifests/dtos/tile.dto';


@QueryHandler(GetTilesQuery)
export class GetTilesHandler implements IQueryHandler<GetTilesQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetTilesQuery): Promise<TileDto> {
        const params = [query.docket];
        let expectedSql = 'select * from expected_uploads where docket=?';
        if (query.county) {
            expectedSql = `${expectedSql} and county=?`;
            params.push(query.county)
        }
        if (query.agency) {
            expectedSql = `${expectedSql} and agency=?`;
            params.push(query.agency)
        }
        if (query.partner) {
            expectedSql = `${expectedSql} and partner=?`;
            params.push(query.partner)
        }
        const expectedCount = await this.repository.query(expectedSql, params);

        const recencySql = 'select * from recency_uploads where docketId=? and year=? and month =?';
        const recencyCount = await this.repository.query(recencySql, [query.docket, query.year, query.month]);

        const overallSql = 'select * from overall_uploads where docketId=?';
        const overallCount = await this.repository.query(overallSql, [query.docket]);

        const consistencySql = 'select * from consistency_uploads where docketId=?';
        const consistencyCount = await this.repository.query(consistencySql, [query.docket]);

        const tileDto = new TileDto(query.docket, +expectedCount[0].expected);
        tileDto.setRecency(+recencyCount[0].recency);
        tileDto.setOverall(+overallCount[0].overall);
        tileDto.setConsistency(+consistencyCount[0].consistency);
        return tileDto;
    }
}
