import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOpenTicketsQuery } from '../impl/get-open-tickets.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { forEach } from 'lodash';

@QueryHandler(GetOpenTicketsQuery)
export class GetOpenTicketsHandler
    implements IQueryHandler<GetOpenTicketsQuery> {
    constructor() {}

    async execute(query: GetOpenTicketsQuery): Promise<any> {
        try {
            let data = fs.readFileSync('ticket_export.json', 'utf8');

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
