import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetTrendsRecencyHandler } from './get-trends-recency.handler';
import { GetTrendsRecencyQuery } from '../impl/get-trends-recency.query';

describe('Get Trends Recency Uploads', () => {
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
                        logging:true
                    }),
                }),
                ManifestsModule,
            ],
        }).compile();

        const handler = module.get<GetTrendsRecencyHandler>(GetTrendsRecencyHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetTrendsRecencyQuery.name);
    });

    it('should get recency uploads', async () => {
        const query = new GetTrendsRecencyQuery('CT','2019,10');
        const result = await queryBus.execute<GetTrendsRecencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By County', async () => {
        const query = new GetTrendsRecencyQuery('CT','2019,10');
        query.county='Kisumu'
        const result = await queryBus.execute<GetTrendsRecencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By Agency', async () => {
        const query = new GetTrendsRecencyQuery('CT','2019,10');
        query.agency='DOD'
        const result = await queryBus.execute<GetTrendsRecencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By Partner', async () => {
        const query = new GetTrendsRecencyQuery('CT','2019,10');
        query.partner='Afya Nyota ya Bonde';
        const result = await queryBus.execute<GetTrendsRecencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
