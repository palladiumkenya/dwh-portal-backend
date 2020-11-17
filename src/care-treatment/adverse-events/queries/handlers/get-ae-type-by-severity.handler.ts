import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeTypeBySeverityQuery } from '../impl/get-ae-type-by-severity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCategories } from '../../entities/fact-trans-ae-categories.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAeTypeBySeverityQuery)
export class GetAeTypeBySeverityHandler implements IQueryHandler<GetAeTypeBySeverityQuery> {
    constructor(
        @InjectRepository(FactTransAeCategories, 'mssql')
        private readonly repository: Repository<FactTransAeCategories>
    ) {
    }

    async execute(query: GetAeTypeBySeverityQuery): Promise<any> {
        const aeTypesBySeverity = this.repository.createQueryBuilder('f')
            .select('[Severity], [AdverseEvent], SUM([Severity_total]) total')
            .where('ISNULL([Severity],\'\') <> \'\'');

        if (query.county) {
            aeTypesBySeverity
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeTypesBySeverity
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeTypesBySeverity
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeTypesBySeverity
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await aeTypesBySeverity
            .groupBy('Severity, AdverseEvent')
            .getRawMany();
    }
}
