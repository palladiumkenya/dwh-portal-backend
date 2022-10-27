import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery } from '../impl/get-cumulative-number-adult-plhiv-who-received-atleast-one-dose.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery)
export class GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseHandler implements IQueryHandler<GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery): Promise<any> {
        const cumulativeWhoReceivedOneDose = this.repository.createQueryBuilder('g')
            .select(['DATENAME(Month,g.DategivenFirstDose) AS DategivenFirstDose,DATENAME(YEAR,g.DategivenFirstDose) AS YearFirstDose, count (*)Num, sum(count (*)) OVER (ORDER BY DATEPART(YEAR, g.DategivenFirstDose), DATEPART(MONTH, g.DategivenFirstDose)) as cumulative'])
            .leftJoin(FactTransCovidVaccines, 'f', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ageLV>=12 and ARTOutcome=\'V\' and (g.DategivenFirstDose >= (DATEADD(MONTH, -12, GETDATE())))');

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
            .groupBy('DATENAME(Month,g.DategivenFirstDose), DATENAME(YEAR,g.DategivenFirstDose), DATEPART(YEAR, g.DategivenFirstDose), DATEPART(MONTH, g.DategivenFirstDose)')
            .orderBy('DATEPART(YEAR, g.DategivenFirstDose), DATEPART(MONTH, g.DategivenFirstDose)')
            .getRawMany();
    }
}
