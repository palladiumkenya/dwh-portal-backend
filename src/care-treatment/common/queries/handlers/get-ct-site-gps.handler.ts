import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtSiteGpsQuery } from '../impl/get-ct-site-gps.query';
import { InjectRepository } from '@nestjs/typeorm';
import { AllEmrSites } from '../../entities/all-emr-sites.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtSiteGpsQuery)
export class GetCtSiteGpsHandler implements IQueryHandler<GetCtSiteGpsQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>
    ) {

    }

    async execute(query: GetCtSiteGpsQuery): Promise<any> {
        const facilities = this.repository.createQueryBuilder('q')
            .select(['facilityId mfl, name facility, county, subCounty, agency, partner, owner, latitude, longitude, EMR emr, isCT, isPkv, isHts'])
            .where('q.name IS NOT NULL');

        if (query.county) {
            facilities.andWhere('q.county IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            facilities.andWhere('q.subCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            facilities.andWhere('q.name IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            facilities.andWhere('q.partner IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            facilities.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     facilities.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        return await facilities.orderBy('q.name').getRawMany();
    }
}
