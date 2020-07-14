import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { Repository } from 'typeorm';
import { GetConsistencyByCountyPartnerQuery } from '../get-consistency-by-county-partner.query';
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

            if(query.agency) {
                consistencyResult = consistencyResult.filter(x => x.agency = query.agency);
            }
            if (query.county) {
                consistencyResult = consistencyResult.filter(x => x.county === query.county);
            }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(x => x.partner === query.partner);
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
