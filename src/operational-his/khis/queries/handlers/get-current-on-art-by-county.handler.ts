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
        let currOnArt = this.repository
            .createQueryBuilder('f')
            .select(
                'sum(CurrentOnART_Total) OnART, isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) OnART20_24, isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) OnART25_Plus,' +
                    'isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_10_14_M ), 0 ) OnART10_14, isnull( SUM ( On_ART_15_19_F ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) OnART15_19, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1, f.County',
            );

        if (
            query.gender &&
            query.gender.includes('Female') &&
            query.gender.includes('Male')
        ) {
            // No action
        } else if (query.gender && query.gender.includes('Female')) {
            currOnArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) OnART, f.County,' +
                        'isnull( SUM ( On_ART_20_24_F ), 0 ) OnART20_24, isnull( SUM ( On_ART_25_Plus_F ), 0 ) OnART25_Plus, isnull( SUM ( On_ART_10_14_F ), 0 ) OnART10_14, isnull( SUM ( On_ART_15_19_F ), 0 ) OnART15_19, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            currOnArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) OnART, f.County,' +
                        'isnull( SUM ( On_ART_20_24_M ), 0 ) OnART20_24, isnull( SUM ( On_ART_25_Plus_M ), 0 ) OnART25_Plus, isnull( SUM ( On_ART_10_14_M ), 0 ) OnART10_14, isnull( SUM ( On_ART_15_19_M ), 0 ) OnART15_19, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1',
                );
        }

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
