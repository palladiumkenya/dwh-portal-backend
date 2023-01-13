import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOpenIssuesByTypeQuery } from '../impl/get-open-issues-by-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as _ from 'lodash';

@QueryHandler(GetOpenIssuesByTypeQuery)
export class GetOpenIssuesByTypeHandler
    implements IQueryHandler<GetOpenIssuesByTypeQuery> {
    constructor() {}

    async execute(query: GetOpenIssuesByTypeQuery): Promise<any> {
        try {
            let data = fs.readFileSync('ticket_export.json', 'utf8');

            var result = _.chain(
                JSON.parse(data).tickets.filter(a => a.status === 'open'),
            )
                .groupBy('category')
                .mapValues(ageArr =>
                    _.groupBy(
                        ageArr,
                        ageObj => ageObj.CustomAttributes.issue_type,
                    ),
                )
                .toPairs()
                .map(currentItem => {
                    return {
                        category: currentItem[0],
                        support: currentItem[1]?.Support?.length ?? 0,
                        enhancement: currentItem[1]?.Enhancement?.length ?? 0,
                        bug: currentItem[1]?.Bug?.length ?? 0,
                        training: currentItem[1]?.Training?.length ?? 0,
                        unclassified: currentItem[1]?.undefined?.length ?? 0,
                    };
                })
                .value();
            return result;

            data = JSON.parse(data).tickets.filter(a => a.status === 'open');

            if (query.county) {
                let county_data = [];
                query.county.forEach(county =>
                    county_data.push(
                        ...JSON.parse(data).filter(
                            b =>
                                b.CustomAttributes.county.toUpperCase() ===
                                county.toUpperCase(),
                        ),
                    ),
                );
                return county_data.length;
            }

            if (query.partner) {
                let partner_data = [];
                query.partner.forEach(partner =>
                    partner_data.push(
                        ...JSON.parse(data).filter(
                            b =>
                                b.CustomAttributes?.service_delivery_patner?.toUpperCase() ===
                                partner.toUpperCase(),
                        ),
                    ),
                );
                return partner_data.length;
            }
            return data.length;
        } catch (err) {
            console.error(err);
        }
    }
}
