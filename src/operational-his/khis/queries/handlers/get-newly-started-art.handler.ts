import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetNewlyStartedArtQuery} from "../impl/get-newly-started-art.query";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetNewlyStartedArtQuery)
export class GetNewlyStartedArtHandler implements IQueryHandler<GetNewlyStartedArtQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetNewlyStartedArtQuery): Promise<any> {
        const newlyStartArt = this.repository.createQueryBuilder('f')
            .select('SUM ( StartedART_Total ) AS StartedART_Total, SUM ( Start_ART_Under_1 ) AS Start_ART_Under_1,' +
                'SUM ( Start_ART_25_Plus_F ) Start_ART_25_Plus_F,' +
                'SUM ( Start_ART_25_Plus_M ) Start_ART_25_Plus_M,'+
                'SUM ( Start_ART_20_24_F ) AS Start_ART_20_24_F,' +
                'SUM ( Start_ART_20_24_M ) AS Start_ART_20_24_M,' +
                'SUM ( Start_ART_15_19_F ) AS Start_ART_15_19_F,' +
                'SUM ( Start_ART_15_19_M ) AS Start_ART_15_19_M,' +
                'SUM ( Start_ART_10_14_F ) AS Start_ART_10_14_F,' +
                'SUM( Start_ART_10_14_M ) AS Start_ART_10_14_M,' +
                'SUM(Start_ART_1_9) AS Start_ART_1_9')

        if (query.county) {
            newlyStartArt
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            newlyStartArt
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            newlyStartArt
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            newlyStartArt
                .andWhere('Agency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.partner) {
            newlyStartArt
                .andWhere('SDP IN (:...partners)', { partners: query.partner });
        }

        if (query.year) {
            newlyStartArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        return await newlyStartArt.getRawOne();
    }
}
