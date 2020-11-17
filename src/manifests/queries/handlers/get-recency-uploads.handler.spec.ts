import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetRecencyUploadsHandler } from './get-recency-uploads.handler';
import { GetRecencyUploadsQuery } from '../impl/get-recency-uploads.query';
import { RecencyUploadsTileDto } from '../../entities/dtos/recency-uploads-tile.dto';

describe('Get Tile Recency Uploads', () => {
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

        const handler = module.get<GetRecencyUploadsHandler>(GetRecencyUploadsHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetRecencyUploadsQuery.name);
    });

    it('should get recency uploads', async () => {
        const query = new GetRecencyUploadsQuery('CT','2019,10');
        const result = await queryBus.execute<GetRecencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.recency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By County', async () => {
        const query = new GetRecencyUploadsQuery('CT','2019,10');
        query.county='Kisumu'
        const result = await queryBus.execute<GetRecencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.recency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By Agency', async () => {
        const query = new GetRecencyUploadsQuery('CT','2019,10');
        query.agency='DOD'
        const result = await queryBus.execute<GetRecencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.recency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get recency uploads By Partner', async () => {
        const query = new GetRecencyUploadsQuery('CT','2019,10');
        query.partner='Afya Nyota ya Bonde';
        const result = await queryBus.execute<GetRecencyUploadsQuery, RecencyUploadsTileDto>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.recency).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
