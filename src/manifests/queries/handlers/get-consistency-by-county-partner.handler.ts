import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { GetConsistencyByCountyPartnerQuery } from '../impl/get-consistency-by-county-partner.query';
import { countBy, fromPairs, sortBy, toPairs } from 'lodash';

@QueryHandler(GetConsistencyByCountyPartnerQuery)
export class GetConsistencyByCountyPartnerHandler implements IQueryHandler<GetConsistencyByCountyPartnerQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetConsistencyByCountyPartnerQuery): Promise<any> {
        const params = [query.getDatePeriod(), query.docket];
        const consistencySql = `EXEC generate_consistency_uploads @PERIOD = '${query.getDatePeriod()}', @docketName ='${
            query.docket
        }'`;
        const results = await this.repository.query(consistencySql, params);
        let consistencyResult = [];
        let consistencyValue = {};
        if(results) {
            consistencyResult = results;
            if (query.county) {
                consistencyResult = consistencyResult.filter(x => query.county.indexOf(x.county) !== -1);
            }
            if (query.subCounty) {
                consistencyResult = consistencyResult.filter(x => query.subCounty.indexOf(x.subCounty) !== -1);
            }
            // if (query.facility) {
            //     consistencyResult = consistencyResult.filter(x => query.facility.indexOf(x.facility) !== -1);
            // }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(x => query.partner.indexOf(x.partner) !== -1);
            }
            if(query.agency) {
                consistencyResult = consistencyResult.filter(x => query.agency.indexOf(x.agency) !== -1);
            }
            if (query.reportingType == 'county') {
                consistencyResult = consistencyResult.map(e => {
                    return {...e, county: e.county.toUpperCase()}
                });
                consistencyValue =  countBy(consistencyResult, 'county');
                consistencyValue = fromPairs(sortBy(toPairs(consistencyValue), 1).reverse());
            }
            else if(query.reportingType == 'partner') {
                consistencyResult = consistencyResult.map(e => {
                    return { ...e, partner: e.partner.toUpperCase() };
                });
                consistencyValue = countBy(consistencyResult, 'partner');
                consistencyValue = fromPairs(sortBy(toPairs(consistencyValue), 1).reverse());
            }
        }
        return consistencyValue;
    }
}
