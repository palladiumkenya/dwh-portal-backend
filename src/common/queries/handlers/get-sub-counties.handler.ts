import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSubCountiesQuery } from '../impl/get-sub-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetSubCountiesQuery)
export class GetSubCountiesHandler
    implements IQueryHandler<GetSubCountiesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetSubCountiesQuery): Promise<any> {
        const subCounties = this.repository
            .createQueryBuilder('q')
            .select('q.subCounty', 'subCounty')
            .where('q.MFLCode > 0');

        if (query.county) {
            subCounties.andWhere('q.county IN (:...county)', {
                county: [query.county],
            });
        }

        // if (query.subCounty) {
        //     subCounties.andWhere('q.subCounty IN (:...subCounty)', { subCounty: [query.subCounty] });
        // }

        // if (query.facility) {
        //     subCounties.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        // }

        // if (query.partner) {
        //     subCounties.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        // }

        // if (query.agency) {
        //     subCounties.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        // if (query.project) {
        //     subCounties.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await subCounties
            .orderBy('q.subCounty')
            .distinct(true)
            .getRawMany();
    }
}
