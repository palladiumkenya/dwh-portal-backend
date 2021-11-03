import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../entities/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetTimeToArtFacilitiesQuery } from '../impl/get-time-to-art-facilities.query';

@QueryHandler(GetTimeToArtFacilitiesQuery)
export class GetTimeToArtFacilitiesHandler implements IQueryHandler<GetTimeToArtFacilitiesQuery> {
    constructor(
        @InjectRepository(FactCTTimeToArt, 'mssql')
        private readonly repository: Repository<FactCTTimeToArt>
    ) {

    }

    async execute(query: GetTimeToArtFacilitiesQuery): Promise<any> {
        const timeToArtFacilities = this.repository.createQueryBuilder('f')
            .select(['[TimeToARTDiagnosis_Grp] period, [StartART_Year] year, [StartART_Month] month, [FacilityName] facility, [County] county,[Subcounty] subCounty, [CTPartner] partner, SUM([NumPatients]) txNew'])
            .where('f.[NumPatients] > 0')
            .andWhere('f.[TimeToARTDiagnosis_Grp] IS NOT NULL');

        if (query.partner) {
            timeToArtFacilities.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.county) {
            timeToArtFacilities.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            timeToArtFacilities.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            timeToArtFacilities.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            timeToArtFacilities.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                timeToArtFacilities.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                timeToArtFacilities.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }

        if(query.month) {
            timeToArtFacilities.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        return await timeToArtFacilities
            .groupBy('f.[TimeToARTDiagnosis_Grp], f.[StartART_Year], f.[StartART_Month], f.[CTPartner], f.[County], f.[subCounty], f.[FacilityName]')
            .orderBy('f.[TimeToARTDiagnosis_Grp], f.[StartART_Year], f.[StartART_Month]')
            .getRawMany();
    }
}
