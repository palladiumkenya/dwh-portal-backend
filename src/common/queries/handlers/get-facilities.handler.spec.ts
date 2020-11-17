import {  QueryBus } from '@nestjs/cqrs';
import {  TypeOrmModule } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DimFacility } from '../../entities/dim-facility.entity';
import { getTestDimFacilities } from '../../../../test/test.data';
import { CommonModule } from '../../common.module';
import { GetFacilitiesHandler } from './get-facilities.handler';
import { GetFacilitiesQuery } from '../impl/get-facilities.query';

describe('Get Facilities Test', () => {
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
        const handler = module.get<GetFacilitiesHandler>(GetFacilitiesHandler);
        queryBus = module.get<QueryBus>(QueryBus);
        queryBus.bind(handler, GetFacilitiesQuery.name);
    });

    it('should get Facilities', async () => {
        const query = new GetFacilitiesQuery();
        const result = await queryBus.execute<GetFacilitiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.name}`));
    });

    it('should get Facilities by Agencies', async () => {
        const query = new GetFacilitiesQuery();
        query.agencies=['CDC']
        const result = await queryBus.execute<GetFacilitiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.name}|${c.agency}`));
    });

    it('should get Facilities by Patner', async () => {
        const query = new GetFacilitiesQuery();
        query.partners=['CRISSP']
        const result = await queryBus.execute<GetFacilitiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.name}|${c.partner}`));
    });

    it('should get Facilities by County', async () => {
        const query = new GetFacilitiesQuery();
        query.counties=['Murang\'a']
        const result = await queryBus.execute<GetFacilitiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.name}|${c.county}`));
    });

    it('should get Facilities by Agency County Partner', async () => {
        const query = new GetFacilitiesQuery();
        query.agencies=['CDC']
        query.partners=['CHS Tegemeza Plus']
        query.counties=['Murang\'a']
        const result = await queryBus.execute<GetFacilitiesQuery, any>(query);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(c => Logger.debug(`${c.name}|${c.agency}|${c.partner}|${c.county}`));
    });

});
