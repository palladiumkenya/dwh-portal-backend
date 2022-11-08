import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketsBySDPQuery } from '../impl/get-tickets-by-sdp.query';
import * as fs from 'fs';
import * as _ from 'lodash';

@QueryHandler(GetTicketsBySDPQuery)
export class GetTicketsBySDPHandler
    implements IQueryHandler<GetTicketsBySDPQuery> {
    constructor() {}

    async execute(query: GetTicketsBySDPQuery): Promise<any> {
        try {
            let data = fs.readFileSync('ticket_export.json', 'utf8');

            var result = _.chain(JSON.parse(data).tickets)
                .groupBy('CustomAttributes.service_delivery_patner')
                .mapValues(ageArr => _.groupBy(ageArr, ageObj => ageObj.status))
                .toPairs()
                .map(currentItem => {
                    return {
                        sdp: currentItem[0],
                        closed: currentItem[1]?.closed?.length ?? 0,
                        open: currentItem[1]?.open?.length ?? 0,
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
