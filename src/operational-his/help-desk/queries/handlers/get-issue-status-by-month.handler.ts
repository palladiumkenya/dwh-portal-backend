import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistTicketExport } from '../../entities/linelist-ticket-export.model';
import { GetIssueStatusByMonthQuery } from '../impl/get-issue-status-by-month.query';

@QueryHandler(GetIssueStatusByMonthQuery)
export class GetIssueStatusByMonthHandler
    implements IQueryHandler<GetIssueStatusByMonthQuery> {
    constructor(
        @InjectRepository(LinelistTicketExport, 'mssql')
        private readonly repository: Repository<LinelistTicketExport>,
    ) {}

    async execute(query: GetIssueStatusByMonthQuery): Promise<any> {
        let ticketOverview = this.repository.createQueryBuilder('f').select(
            `MONTH( [Created On] ) MONTH,
            YEAR( [Created On] ) YEAR,
            COUNT ( CASE WHEN status = 'closed' THEN 1 END ) closed,
            COUNT ( CASE WHEN status = 'open' THEN 1 END ) opened `,
        );

        if (query.county) {
            ticketOverview.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        // if (query.subCounty) {
        //     ticketOverview.andWhere('f.Subcounty IN (:...subCounties)', {
        //         subCounties: query.subCounty,
        //     });
        // }

        if (query.facility) {
            ticketOverview.andWhere(
                `f.[User's Facility/Organization] IN (:...facilities)`,
                {
                    facilities: query.facility,
                },
            );
        }
        if (query.partner) {
            ticketOverview.andWhere(
                '[Service Delivery Patner] IN (:...partners)',
                {
                    partners: query.partner,
                },
            );
        }

        // if (query.agency) {
        //     ticketOverview.andWhere('AgencyName IN (:...agencies)', {
        //         agencies: query.agency,
        //     });
        // }

        if (query.year) {
            ticketOverview.andWhere('year([Created On]) = :year', {
                year: query.year,
            });
        }

        if (query.month) {
            ticketOverview.andWhere('Month([Created On]) = :month', {
                month: query.month,
            });
        }

        ticketOverview
            .groupBy(
                'MONTH ( [Created On] ), YEAR ( [Created On] )',
            )
            .orderBy(`YEAR ( [Created On] )`, `DESC`)
            .addOrderBy(` MONTH ( [Created On] )`, `DESC`);
        
        return await ticketOverview.getRawMany();
    }
}
