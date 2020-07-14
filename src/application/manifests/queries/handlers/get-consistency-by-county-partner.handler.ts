import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { Repository } from 'typeorm';
import { GetConsistencyByCountyPartnerQuery } from '../get-consistency-by-county-partner.query';

@QueryHandler(GetConsistencyByCountyPartnerQuery)
export class GetConsistencyByCountyHandler implements IQueryHandler<GetConsistencyByCountyPartnerQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }
}
