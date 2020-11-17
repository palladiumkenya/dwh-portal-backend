import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetTrendsConsistencyHandler } from './get-trends-consistency.handler';
import { GetTrendsConsistencyQuery } from '../impl/get-trends-consistency.query';

describe('Get Trends Consistency uploads', () => {
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

        const handler = module.get<GetTrendsConsistencyHandler>(GetTrendsConsistencyHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetTrendsConsistencyQuery.name);
    });

    it('should get consistency uploads', async () => {
        const query = new GetTrendsConsistencyQuery('CT','2019,10');
        const result = await queryBus.execute<GetTrendsConsistencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By County', async () => {
        const query = new GetTrendsConsistencyQuery('CT','2019,10');
        query.county='Kisumu'
        const result = await queryBus.execute<GetTrendsConsistencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By Agency', async () => {
        const query = new GetTrendsConsistencyQuery('CT','2019,10');
        query.agency='CDC'
        const result = await queryBus.execute<GetTrendsConsistencyQuery, any>(query)
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By Partner', async () => {
        const query = new GetTrendsConsistencyQuery('CT','2019,10');
        query.partner='CHS Shinda';
        const result = await queryBus.execute<GetTrendsConsistencyQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
