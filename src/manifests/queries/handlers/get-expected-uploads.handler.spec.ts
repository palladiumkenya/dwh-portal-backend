import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetExpectedUploadsHandler } from './get-expected-uploads.handler';
import { GetExpectedUploadsQuery } from '../impl/get-expected-uploads.query';
import { ExpectedUploadsTileDto } from '../../entities/dtos/expected-uploads-tile.dto';

describe('Get Tile Expected uploads', () => {
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

        const handler = module.get<GetExpectedUploadsHandler>(GetExpectedUploadsHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetExpectedUploadsQuery.name);
    });

    it('should get overall uploads', async () => {
        const query = new GetExpectedUploadsQuery('PKV');
        const result = await queryBus.execute<GetExpectedUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By County', async () => {
        const query = new GetExpectedUploadsQuery('PKV');
        query.county=['Kisumu']
        const result = await queryBus.execute<GetExpectedUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By Agency', async () => {
        const query = new GetExpectedUploadsQuery('PKV');
        query.agency=['DOD']
        const result = await queryBus.execute<GetExpectedUploadsQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get overall uploads By Partner', async () => {
        const query = new GetExpectedUploadsQuery('PKV');
        query.partner=['WRP-South Rift'];
        const result = await queryBus.execute<GetExpectedUploadsQuery, ExpectedUploadsTileDto>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.expected).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
