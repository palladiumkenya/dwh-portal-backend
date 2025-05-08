import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetFacilitiesQuery } from '../impl/get-facilities.query';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetFacilitiesQuery)
export class GetFacilitiesHandler implements IQueryHandler<GetFacilitiesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilitiesQuery): Promise<any> {
        const facilities = this.repository
            .createQueryBuilder('q')
            .select('q.FacilityName', 'facility')
            .where('q.MFLCode > 0');

        if (query.county) {
            facilities.andWhere('q.county IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilities.andWhere('q.subCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        // if (query.facility) {
        //     facilities.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        // }

        // if (query.partner) {
        //     facilities.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        // }

        // if (query.agency) {
        //     facilities.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        // if (query.project) {
        //     facilities.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await facilities
            .orderBy('q.Facilityname')
            .distinct(true)
            .getRawMany();
    }
}
