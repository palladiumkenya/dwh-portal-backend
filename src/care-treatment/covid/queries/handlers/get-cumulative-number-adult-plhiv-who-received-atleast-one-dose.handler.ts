import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery } from '../impl/get-cumulative-number-adult-plhiv-who-received-atleast-one-dose.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret Error: Arithmetic overflow error converting expression to data type datetime.
@QueryHandler(GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery)
export class GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseHandler implements IQueryHandler<GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery): Promise<any> {
        const cumulativeWhoReceivedOneDose = this.repository.createQueryBuilder('g')
            .select(['DATENAME(Month,g.DateGivenFirstDoseKey) AS DategivenFirstDose,DATENAME(YEAR,g.DateGivenFirstDoseKey) AS YearFirstDose, count (*)Num, sum(count (*)) OVER (ORDER BY DATEPART(YEAR, g.DateGivenFirstDoseKey), DATEPART(MONTH, g.DateGivenFirstDoseKey)) as cumulative'])
           
            .where('(g.DateGivenFirstDoseKey >= (DATEADD(MONTH, -12, GETDATE())))');

        if (query.county) {
            cumulativeWhoReceivedOneDose.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            cumulativeWhoReceivedOneDose.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            cumulativeWhoReceivedOneDose.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            cumulativeWhoReceivedOneDose.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            cumulativeWhoReceivedOneDose.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            cumulativeWhoReceivedOneDose.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            cumulativeWhoReceivedOneDose.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await cumulativeWhoReceivedOneDose
            .groupBy('DATENAME(Month,g.DateGivenFirstDoseKey), DATENAME(YEAR,g.DateGivenFirstDoseKey), DATEPART(YEAR, g.DateGivenFirstDoseKey), DATEPART(MONTH, g.DateGivenFirstDoseKey)')
            .orderBy('DATEPART(YEAR, g.DateGivenFirstDoseKey), DATEPART(MONTH, g.DateGivenFirstDoseKey)')
            .getRawMany();
    }
}
