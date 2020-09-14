import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../../../entities/care_treatment/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetTimeToArtQuery } from '../get-time-to-art.query';

@QueryHandler(GetTimeToArtQuery)
export class GetTimeToArtHandler implements IQueryHandler<GetTimeToArtQuery> {
    constructor(
        @InjectRepository(FactCTTimeToArt, 'mssql')
        private readonly repository: Repository<FactCTTimeToArt>
    ) {

    }

    async execute(query: GetTimeToArtQuery): Promise<any> {
        const timeToArt = this.repository.createQueryBuilder('f')
            .select(['[StartART_Year] year, [TimeToARTStart_Grp] period, SUM([NumPatients]) txNew'])
            .where('f.[NumPatients] > 0')
            .andWhere('f.[TimeToARTStart_Grp] IS NOT NULL');

        if (query.county) {
            timeToArt.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            timeToArt.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            timeToArt.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            timeToArt.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if(query.month) {
            timeToArt.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                timeToArt.andWhere('f.StartART_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                timeToArt.andWhere('f.StartART_Year = :startYear', { startYear: query.year });
            }
        }

        return await timeToArt
            .groupBy('f.[StartART_Year], f.[TimeToARTStart_Grp]')
            .orderBy('f.[StartART_Year], f.[TimeToARTStart_Grp]')
            .getRawMany();
    }
}
