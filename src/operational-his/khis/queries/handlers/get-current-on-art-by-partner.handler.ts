import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetCurrentOnArtByPartnerQuery} from "../impl/get-current-on-art-by-partner.query";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetCurrentOnArtByPartnerQuery)
export class GetCurrentOnArtByPartnerHandler implements IQueryHandler<GetCurrentOnArtByPartnerQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetCurrentOnArtByPartnerQuery): Promise<any> {
        const currOnArt = this.repository.createQueryBuilder('f')
            .select('sum(CurrentOnART_Total) OnART, g.partner')
            .leftJoin(AllEmrSites, 'g', 'CAST(g.facilityId as int) = CAST(f.SiteCode as int)')
            .where('ReportMonth_Year = 202205')


        if (query.county) {
            currOnArt
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            currOnArt
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            currOnArt
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            currOnArt
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        currOnArt.groupBy('g.partner').orderBy('OnART', 'DESC');

        return await currOnArt.getRawMany();
    }
}
