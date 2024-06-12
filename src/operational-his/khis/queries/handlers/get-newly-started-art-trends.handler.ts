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
            .select('SUM(StartedART_Total) AS StartedART_Total, ReportMonth_Year,' +
            'SUM ( Start_ART_Under_1 ) AS Start_ART_Under_1,' +
                    'SUM ( Start_ART_25_Plus_F ) + SUM ( Start_ART_25_Plus_M ) Start_ART_25_Plus,' +
                    'SUM ( Start_ART_20_24_F ) + SUM ( Start_ART_20_24_M ) Start_ART_20_24,' +
                    'SUM ( Start_ART_15_19_F ) + SUM ( Start_ART_15_19_M ) Start_ART_15_19,' +
                    'SUM ( Start_ART_10_14_F ) + SUM ( Start_ART_10_14_M ) Start_ART_10_14,' +
                    'SUM(Start_ART_1_9) Start_ART_1_9')

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
                        'ReportMonth_Year, 0 Start_ART_Under_1, SUM ( Start_ART_25_Plus_F ) Start_ART_25_Plus,' +
                    'SUM ( Start_ART_20_24_F ) Start_ART_20_24,' +
                    'SUM ( Start_ART_15_19_F ) Start_ART_15_19,' +
                    'SUM ( Start_ART_10_14_F ) Start_ART_10_14,' +
                    '0 Start_ART_1_9',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            newlyStartArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( Start_ART_20_24_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM ( Start_ART_15_19_M ), 0 )  StartedART_Total,' +
                        'ReportMonth_Year, 0 Start_ART_Under_1, SUM ( Start_ART_25_Plus_M ) Start_ART_25_Plus,' +
                    'SUM ( Start_ART_20_24_M ) Start_ART_20_24,' +
                    'SUM ( Start_ART_15_19_M ) Start_ART_15_19,' +
                    'SUM ( Start_ART_10_14_M ) Start_ART_10_14,' +
                    '0 Start_ART_1_9',
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
                .andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            newlyStartArt
                .andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.year) {
            newlyStartArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        newlyStartArt.groupBy('ReportMonth_Year').orderBy('ReportMonth_Year', 'DESC');

        return await newlyStartArt.getRawMany();
    }
}
