import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdverseEventsClientsQuery } from '../impl/get-adverse-events-clients.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeClients } from '../../entities/fact-trans-ae-clients.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAdverseEventsClientsQuery)
export class GetAdverseEventsClientsHandler implements IQueryHandler<GetAdverseEventsClientsQuery> {
    constructor(
        @InjectRepository(FactTransAeClients, 'mssql')
        private readonly repository: Repository<FactTransAeClients>
    ) {
    }

    async execute(query: GetAdverseEventsClientsQuery): Promise<any> {
        const adultsAEs = this.repository.createQueryBuilder('f')
            .select('SUM([Total]) total, AgeGroup, Gender, CAST((cast(SUM([Total]) as decimal (9,2))/ (SUM(SUM([Total])) OVER (PARTITION BY AgeGroup ORDER BY AgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup')
            .where('[AgeGroup] IS NOT NULL');

        if (query.county) {
            adultsAEs
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultsAEs
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultsAEs
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultsAEs
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await adultsAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
