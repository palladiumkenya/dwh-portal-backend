import { QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { GetTilesQuery } from '../get-tiles.query';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetTrendsHandler } from './get-trends.handler';
import { GetTrendsQuery } from '../get-trends.query';
import { TrendDto } from '../../../../entities/manifests/dtos/trend.dto';

describe('Get Trends Test', () => {
    let module: TestingModule;
    let queryBus: QueryBus;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: 'mysql',
                        host: 'localhost',
                        username: 'dwapi',
                        password: 'dwapi',
                        database: 'portalDev',
                        entities: [FactManifest],
                        logging: true,
                    }),
                }),
                ManifestsModule,
            ],
        }).compile();

        const handler = module.get<GetTrendsHandler>(GetTrendsHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetTrendsQuery.name);
    });

    it('should get trends', async () => {
        const query = new GetTrendsQuery('HTS', 2020, 1);
        const result = await queryBus.execute<GetTrendsQuery, TrendDto[]>(query);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].docket).toBe('HTS');
        expect(result[0].expected).toBeGreaterThan(0);
        expect(result[0].trend).toBeGreaterThan(0);
        expect(result[0].trendPerc).toBeGreaterThan(0);
        Logger.debug(result);
    });

});
