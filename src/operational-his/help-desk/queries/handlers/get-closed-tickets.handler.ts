import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClosedTicketsQuery } from '../impl/get-closed-tickets.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { forEach } from 'lodash';

@QueryHandler(GetClosedTicketsQuery)
export class GetClosedTicketsHandler
    implements IQueryHandler<GetClosedTicketsQuery> {
    constructor() {}

    async execute(query: GetClosedTicketsQuery): Promise<any> {
        try {
            let data = fs.readFileSync('ticket_export.json', 'utf8');

            data = JSON.parse(data).tickets.filter(a => a.status === 'closed');

            if (query.county) {
                let county_data = []
                query.county.forEach(county =>
                    county_data.push(
                        ...JSON.parse(data).filter(
                            b =>
                                b.CustomAttributes.county.toUpperCase() ===
                                county.toUpperCase(),
                        ),
                    ),
                );
                return county_data.length
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


        // if (query.facility) {
        //     txCurrAgeGroupDistributionByCounty.andWhere(
        //         'f.FacilityName IN (:...facilities)',
        //         { facilities: query.facility },
        //     );
        // }

        // if (query.partner) {
        //     txCurrAgeGroupDistributionByCounty.andWhere(
        //         'f.CTPartner IN (:...partners)',
        //         { partners: query.partner },
        //     );
        // }

        // if (query.agency) {
        //     txCurrAgeGroupDistributionByCounty.andWhere(
        //         'f.CTAgency IN (:...agencies)',
        //         { agencies: query.agency },
        //     );
        // }

        // return txCurrAgeGroupDistributionByCounty
    }
}
