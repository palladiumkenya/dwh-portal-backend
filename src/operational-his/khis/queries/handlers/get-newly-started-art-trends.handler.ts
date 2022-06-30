import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetNewlyStartedArtTrendsQuery} from "../impl/get-newly-started-art-trends.query";

@QueryHandler(GetNewlyStartedArtTrendsQuery)
export class GetNewlyStartedArtTrendsHandler implements IQueryHandler<GetNewlyStartedArtTrendsQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetNewlyStartedArtTrendsQuery): Promise<any> {
        const newlyStartArt = this.repository.createQueryBuilder('f')
            .select('SUM(StartedART_Total) AS StartedART_Total, ReportMonth_Year')


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
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        newlyStartArt.groupBy('ReportMonth_Year').orderBy('ReportMonth_Year', 'DESC');

        return await newlyStartArt.getRawMany();
    }
}
