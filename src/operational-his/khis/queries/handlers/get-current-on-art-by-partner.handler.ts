import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetCurrentOnArtByPartnerQuery} from "../impl/get-current-on-art-by-partner.query";

@QueryHandler(GetCurrentOnArtByPartnerQuery)
export class GetCurrentOnArtByPartnerHandler implements IQueryHandler<GetCurrentOnArtByPartnerQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetCurrentOnArtByPartnerQuery): Promise<any> {
        let currOnArt = this.repository
            .createQueryBuilder('f')
            .select(
                'sum(CurrentOnART_Total) OnART, isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) OnART20_24, isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) OnART25_Plus,' +
                    'isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_10_14_M ), 0 ) OnART10_14, isnull( SUM ( On_ART_15_19_F ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) OnART15_19, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1,PartnerName SDP',
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
                    'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) OnART, f.PartnerName SDP,' +
                        'isnull( SUM ( On_ART_20_24_F ), 0 ) OnART20_24, isnull( SUM ( On_ART_25_Plus_F ), 0 ) OnART25_Plus, isnull( SUM ( On_ART_10_14_F ), 0 ) OnART10_14, isnull( SUM ( On_ART_15_19_F ), 0 ) OnART15_19, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            currOnArt = this.repository
                .createQueryBuilder('f')
                .select(
                    'isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) OnART, f.PartnerName SDP,' +
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

        if (query.agency) {
            currOnArt
                .andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.partner) {
            currOnArt
                .andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.year) {
            currOnArt
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        currOnArt.groupBy('PartnerName').orderBy('OnART', 'DESC');

        return await currOnArt.getRawMany();
    }
}
