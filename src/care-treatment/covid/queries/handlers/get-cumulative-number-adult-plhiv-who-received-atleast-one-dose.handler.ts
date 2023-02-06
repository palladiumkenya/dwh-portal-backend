import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery } from '../impl/get-cumulative-number-adult-plhiv-who-received-atleast-one-dose.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';
//Margaret
@QueryHandler(GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery)
export class GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseHandler implements IQueryHandler<GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery): Promise<any> {
        const cumulativeWhoReceivedOneDose = this.repository.createQueryBuilder('g')
            .select(['DATENAME(Month,DateGivenFirstDoseKey) AS DategivenFirstDose,DATENAME(YEAR,DateGivenFirstDoseKey) AS YearFirstDose, count (*)Num, sum(count (*)) OVER (ORDER BY DATEPART(YEAR, DateGivenFirstDoseKey), DATEPART(MONTH, DateGivenFirstDoseKey)) as cumulative'])
            .where(' (DateGivenFirstDoseKey >= (DATEADD(MONTH, -12, GETDATE())))');

        if (query.county) {
            cumulativeWhoReceivedOneDose.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            cumulativeWhoReceivedOneDose.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            cumulativeWhoReceivedOneDose.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            cumulativeWhoReceivedOneDose.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            cumulativeWhoReceivedOneDose.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            cumulativeWhoReceivedOneDose.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            cumulativeWhoReceivedOneDose.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await cumulativeWhoReceivedOneDose
            .groupBy('DATENAME(Month,DateGivenFirstDoseKey), DATENAME(YEAR,DateGivenFirstDoseKey), DATEPART(YEAR, DateGivenFirstDoseKey), DATEPART(MONTH, DateGivenFirstDoseKey)')
            .orderBy('DATEPART(YEAR, DateGivenFirstDoseKey), DATEPART(MONTH, DateGivenFirstDoseKey)')
            .getRawMany();
    }
}
