import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { GetConsistencyByCountyPartnerQuery } from '../impl/get-consistency-by-county-partner.query';
import { countBy, fromPairs, sortBy, toPairs } from 'lodash';

@QueryHandler(GetConsistencyByCountyPartnerQuery)
export class GetConsistencyByCountyPartnerHandler implements IQueryHandler<GetConsistencyByCountyPartnerQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetConsistencyByCountyPartnerQuery): Promise<any> {
        const params = [query.getDatePeriod(), query.docket];
        const consistencySql = 'call generate_consistency_uploads(?,?)';
        const results = await this.repository.query(consistencySql, params);
        let consistencyResult = [];
        let consistencyValue = {};
        if(results && results[0].length > 0) {
            consistencyResult = results[0];
            if (query.county) {
                consistencyResult = consistencyResult.filter(x => query.county.indexOf(x.county) !== -1);
            }
            // if (query.subCounty) {
            //     consistencyResult = consistencyResult.filter(x => query.subCounty.indexOf(x.subCounty) !== -1);
            // }
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
                consistencyValue =  countBy(consistencyResult, 'county');
                consistencyValue = fromPairs(sortBy(toPairs(consistencyValue), 1).reverse());
            }
            else if(query.reportingType == 'partner') {
                consistencyValue = countBy(consistencyResult, 'partner');
                consistencyValue = fromPairs(sortBy(toPairs(consistencyValue), 1).reverse());
            }
        }
        return consistencyValue;
    }
}
