import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetConsistencyUploadsHandler } from './get-consistency-uploads.handler';
import { GetConsistencyUploadsQuery } from '../impl/get-consistency-uploads.query';
import { ConsistencyUploadsTileDto } from '../../entities/dtos/consistency-uploads-tile.dto';

describe('Get Tile Consistency uploads', () => {
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

        const handler = module.get<GetConsistencyUploadsHandler>(GetConsistencyUploadsHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetConsistencyUploadsQuery.name);
    });

    it('should get consistency uploads', async () => {
        const query = new GetConsistencyUploadsQuery('CT','2019,10');
        const result = await queryBus.execute<GetConsistencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.consistency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By County', async () => {
        const query = new GetConsistencyUploadsQuery('CT','2019,10');
        query.county=['Kisumu']
        const result = await queryBus.execute<GetConsistencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.consistency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By Agency', async () => {
        const query = new GetConsistencyUploadsQuery('CT','2019,10');
        query.agency=['CDC']
        const result = await queryBus.execute<GetConsistencyUploadsQuery, any>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.consistency).toBeGreaterThan(0);
        Logger.debug(result)
    });

    it('should get consistency uploads By Partner', async () => {
        const query = new GetConsistencyUploadsQuery('CT','2019,10');
        query.partner=['CHS Shinda'];
        const result = await queryBus.execute<GetConsistencyUploadsQuery, ConsistencyUploadsTileDto>(query);
        expect(result.docket).toBe(query.docket);
        expect(result.consistency).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
