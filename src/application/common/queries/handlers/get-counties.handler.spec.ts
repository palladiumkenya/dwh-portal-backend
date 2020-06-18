import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { GetCountiesHandler } from './get-counties.handler';
import { getTestDimFacilities } from '../../../../../test/test.data';
import { GetCountiesQuery } from '../get-counties.query';
import { CommonModule } from '../../common.module';

describe('Get Counties Test', () => {
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
        const handler = module.get<GetCountiesHandler>(GetCountiesHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetCountiesQuery.name);
    });

    it('should get counties', async () => {
        const query = new GetCountiesQuery();
        const result = await queryBus.execute<GetCountiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.county}`));
    });

});
