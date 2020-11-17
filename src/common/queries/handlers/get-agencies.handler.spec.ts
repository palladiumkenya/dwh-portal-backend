import { QueryBus } from '@nestjs/cqrs';
import {  TypeOrmModule } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DimFacility } from '../../entities/dim-facility.entity';
import { getTestDimFacilities } from '../../../../test/test.data';
import { CommonModule } from '../../common.module';
import { GetAgenciesHandler } from './get-agencies.handler';
import { GetAgenciesQuery } from '../impl/get-agencies.query';

describe('Get Agencies Test', () => {
    let module: TestingModule;
    let queryBus: QueryBus;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: 'sqlite',
                        database: ':memory:',
                        entities: [DimFacility],
                        dropSchema: true,
                        synchronize: true,
                        logging:false
                    }),
                }),
                CommonModule,
            ],
        }).compile();

        const data = await getTestDimFacilities();
        const entityManager = getManager();
        for (const f of data) {
            await entityManager.save(data);
        }
        const handler = module.get<GetAgenciesHandler>(GetAgenciesHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetAgenciesQuery.name);
    });

    it('should get agencies', async () => {
        const query = new GetAgenciesQuery();
        const result = await queryBus.execute<GetAgenciesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.agency}`));
    });
    it('should get agencies by county', async () => {
        const query = new GetAgenciesQuery('Nyandarua');
        const result = await queryBus.execute<GetAgenciesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.agency}`));
    });

});
