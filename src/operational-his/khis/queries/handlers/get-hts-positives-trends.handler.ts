import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GetHtsPositivesTrendsQuery} from "../impl/get-hts-positives-trends.query";
import {FactHtsDhis2} from "../../entities/fact-hts-dhis2.model";

@QueryHandler(GetHtsPositivesTrendsQuery)
export class GetHtsPositivesTrendsHandler implements IQueryHandler<GetHtsPositivesTrendsQuery> {
    constructor(
        @InjectRepository(FactHtsDhis2, 'mssql')
        private readonly repository: Repository<FactHtsDhis2>
    ) {
    }

    async execute(query: GetHtsPositivesTrendsQuery): Promise<any> {
        const htsPositives = this.repository.createQueryBuilder('f')
            .select('sum(Tested_Total) tested, sum(Positive_Total) positive, ReportMonth_Year')


        if (query.county) {
            htsPositives
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            htsPositives
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            htsPositives
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            htsPositives
                .andWhere('[AgencyName] IN (:...agencies)', { agencies: query.agency });
        }

        if (query.partner) {
            htsPositives
                .andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.year) {
            htsPositives
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        htsPositives.groupBy('ReportMonth_Year').orderBy('ReportMonth_Year', 'DESC');

        return await htsPositives.getRawMany();
    }
}
