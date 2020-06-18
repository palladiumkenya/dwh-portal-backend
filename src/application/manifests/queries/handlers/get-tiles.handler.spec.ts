import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ManifestsModule } from '../../manifests.module';
import { GetTilesHandler } from './get-tiles.handler';
import { GetTilesQuery } from '../get-tiles.query';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { TileDto } from '../../../../entities/manifests/dtos/tile.dto';

describe('Get Tiles Test', () => {
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

        const handler = module.get<GetTilesHandler>(GetTilesHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetTilesQuery.name);
    });

    it('should get uploads', async () => {
        const query = new GetTilesQuery('PKV',2020,1);
        const result = await queryBus.execute<GetTilesQuery, TileDto>(query);
        expect(result.docket).toBe('PKV');
        expect(result.expected).toBeGreaterThan(0);
        expect(result.recency).toBeGreaterThan(0);
        expect(result.recencyPerc).toBeGreaterThan(0);
        Logger.debug(result)
    });

});
