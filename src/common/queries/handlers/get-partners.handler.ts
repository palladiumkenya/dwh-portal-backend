import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetPartnersQuery } from '../impl/get-partners.query';
import { AllEmrSites } from './../../../care-treatment/common/entities/all-emr-sites.model';


@QueryHandler(GetPartnersQuery)
export class GetPartnersHandler implements IQueryHandler<GetPartnersQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetPartnersQuery): Promise<any> {
        const partners = this.repository
            .createQueryBuilder('q')
            .select('q.partnerName', 'partner')
            .where('q.MFLCode > 0');

        if (query.county) {
            partners.andWhere('q.county IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            partners.andWhere('q.subCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        // if (query.facility) {
        //     partners.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        // }

        // if (query.partner) {
        //     partners.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        // }

        // if (query.agency) {
        //     partners.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        // if (query.project) {
        //     partners.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await partners
            .orderBy('q.partnerName')
            .distinct(true)
            .getRawMany();
    }
}
