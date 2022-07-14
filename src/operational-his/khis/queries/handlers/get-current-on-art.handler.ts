import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetCurrentOnArtQuery} from "../impl/get-current-on-art.query";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetCurrentOnArtQuery)
export class GetCurrentOnArtHandler implements IQueryHandler<GetCurrentOnArtQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetCurrentOnArtQuery): Promise<any> {
        const currentOnArt = this.repository.createQueryBuilder('f')
            .select('sum(CurrentOnART_Total) CurrentOnART_Total, sum(On_ART_Under_1) On_ART_Under_1, sum(On_ART_1_9) On_ART_1_9, sum(On_ART_10_14_M) On_ART_10_14_M, sum(On_ART_10_14_F) On_ART_10_14_F, sum(On_ART_15_19_M) On_ART_15_19_M, sum(On_ART_15_19_F) On_ART_15_19_F, sum(On_ART_20_24_M) On_ART_20_24_M, sum(On_ART_20_24_F) On_ART_20_24_F, sum(On_ART_25_Plus_M) On_ART_25_Plus_M, sum(On_ART_25_Plus_F) On_ART_25_Plus_F')


        if (query.county) {
            currentOnArt
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            currentOnArt
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            currentOnArt
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            currentOnArt
                .andWhere('SDP IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            currentOnArt
                .andWhere('Agency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.year) {
            currentOnArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        return await currentOnArt.getRawOne();
    }
}
