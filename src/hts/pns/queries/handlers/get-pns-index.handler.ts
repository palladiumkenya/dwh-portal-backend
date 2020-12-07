import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsIndexQuery } from '../impl/get-pns-index.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsuptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsIndexQuery)
export class GetPnsIndexHandler implements IQueryHandler<GetPnsIndexQuery> {
    constructor(
        @InjectRepository(FactHtsuptake)
        private readonly repository: Repository<FactHtsuptake>
    ) {

    }

    async execute(query: GetPnsIndexQuery): Promise<any> {
        const pnsIndex = this.repository.createQueryBuilder('q')
            .select(['SUM(q.positive) indexClients'])
            .where('q.positive > 0');

        if(query.county) {
            pnsIndex.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsIndex.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsIndex.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsIndex.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        if(query.month) {
            pnsIndex.andWhere('q.month = :month', { month: query.month });
        }

        if(query.year) {
            pnsIndex.andWhere('q.year = :year', { year: query.year});
        }

        return await pnsIndex.getRawOne();
    }
}
