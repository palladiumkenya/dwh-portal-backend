import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetOverallUploadsHandler } from './get-overall-uploads.handler';
import { GetOverallUploadsQuery } from '../get-overall-uploads.query';
import { OverallUploadsTileDto } from '../../../../entities/manifests/dtos/overall-uploads-tile.dto';

describe('Get Tile Overall uploads', () => {
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

        const handler = module.get<GetOverallUploadsHandler>(GetOverallUploadsHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetOverallUploadsQuery.name);
    });

    it('should get overall uploads', async () => {
        const query = new GetOverallUploadsQuery('PKV');
        const result = await queryBus.execute<GetOverallUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By County', async () => {
        const query = new GetOverallUploadsQuery('PKV');
        query.county='Kisumu'
        const result = await queryBus.execute<GetOverallUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By Agency', async () => {
        const query = new GetOverallUploadsQuery('PKV');
        query.agency='DOD'
        const result = await queryBus.execute<GetOverallUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By Partner', async () => {
        const query = new GetOverallUploadsQuery('PKV');
        query.partner='WRP-South Rift';
        const result = await queryBus.execute<GetOverallUploadsQuery, OverallUploadsTileDto>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.overall).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
