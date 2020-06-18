import {  QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { getTestDimFacilities } from '../../../../../test/test.data';
import { CommonModule } from '../../common.module';
import { GetPartnersHandler } from './get-partners.handler';
import { GetPartnersQuery } from '../get-partners.query';

describe('Get Partners Test', () => {
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
                        logging:true
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
        const handler = module.get<GetPartnersHandler>(GetPartnersHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetPartnersQuery.name);
    });

    it('should get partners', async () => {
        const query = new GetPartnersQuery();
        const result = await queryBus.execute<GetPartnersQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.partner}`));
    });

    it('should get partners by agencies', async () => {
        const query = new GetPartnersQuery();
        query.agencies=['USAID','CDC']
        const result = await queryBus.execute<GetPartnersQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.agency} | ${c.partner}`));
    });

    it('should get partners by county', async () => {
        const query = new GetPartnersQuery();
        query.county='Kiambu';
        const result = await queryBus.execute<GetPartnersQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.county} | ${c.partner}`));
    });

    it('should get partners by agency', async () => {
        const query = new GetPartnersQuery();
        query.agency='CDC';
        const result = await queryBus.execute<GetPartnersQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.agency} | ${c.partner}`));
    });

});
