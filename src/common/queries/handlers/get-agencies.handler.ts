import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetAgenciesQuery } from '../impl/get-agencies.query';
import { AllEmrSites } from './../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetAgenciesQuery)
export class GetAgenciesHandler implements IQueryHandler<GetAgenciesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetAgenciesQuery): Promise<any> {
        const agencies = this.repository
            .createQueryBuilder('q')
            .select('q.agencyName', 'agency')
            .where('q.MFLCode > 0');

        if (query.county) {
            agencies.andWhere('q.county IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            agencies.andWhere('q.subCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        // if (query.facility) {
        //     agencies.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        // }

        // if (query.partner) {
        //     agencies.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        // }

        // if (query.agency) {
        //     agencies.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        // if (query.project) {
        //     agencies.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await agencies
            .orderBy('q.agencyName')
            .distinct(true)
            .getRawMany();
    }
}
