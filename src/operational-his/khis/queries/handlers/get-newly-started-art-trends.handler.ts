import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetNewlyStartedArtTrendsQuery} from "../impl/get-newly-started-art-trends.query";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetNewlyStartedArtTrendsQuery)
export class GetNewlyStartedArtTrendsHandler implements IQueryHandler<GetNewlyStartedArtTrendsQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetNewlyStartedArtTrendsQuery): Promise<any> {
        let newlyStartArt = this.repository.createQueryBuilder('f')
            .select('SUM(StartedART_Total) AS StartedART_Total, ReportMonth_Year')

        if (
            query.gender &&
            query.gender.includes('Female') &&
            query.gender.includes('Male')
        ) {
            // No action
        } else if (query.gender && query.gender.includes('Female')) {
            newlyStartArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( Start_ART_20_24_F ), 0 ) + isnull( SUM ( Start_ART_25_Plus_F ), 0 ) + isnull( SUM ( Start_ART_10_14_F ), 0 ) + isnull( SUM ( Start_ART_15_19_F ), 0 )  StartedART_Total,' +
                        'ReportMonth_Year',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            newlyStartArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( Start_ART_20_24_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM ( Start_ART_15_19_M ), 0 )  StartedART_Total,' +
                        'ReportMonth_Year',
                );
        }

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

        if (query.partner) {
            newlyStartArt
                .andWhere('SDP IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            newlyStartArt
                .andWhere('Agency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.year) {
            newlyStartArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        newlyStartArt.groupBy('ReportMonth_Year').orderBy('ReportMonth_Year', 'DESC');

        return await newlyStartArt.getRawMany();
    }
}
