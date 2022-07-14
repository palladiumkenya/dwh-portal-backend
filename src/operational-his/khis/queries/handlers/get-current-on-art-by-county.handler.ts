import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GetCurrentOnArtByCountyQuery} from "../impl/get-current-on-art-by-county.query";
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetCurrentOnArtByCountyQuery)
export class GetCurrentOnArtByCountyHandler implements IQueryHandler<GetCurrentOnArtByCountyQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetCurrentOnArtByCountyQuery): Promise<any> {
        const currOnArt = this.repository.createQueryBuilder('f')
            .select('sum(CurrentOnART_Total) OnART, f.County')


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
                .andWhere('SDP IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            currOnArt
                .andWhere('Agency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.year) {
            currOnArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        currOnArt.groupBy('f.County').orderBy('OnART', 'DESC');

        return await currOnArt.getRawMany();
    }
}
