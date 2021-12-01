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
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseQuery): Promise<any> {
        const cumulativeWhoReceivedOneDose = this.repository.createQueryBuilder('f')
            .select(['DATENAME(Month,DategivenFirstDose) AS DategivenFirstDose,DATENAME(YEAR,DategivenFirstDose) AS YearFirstDose, count (*)Num, sum(count (*)) OVER (ORDER BY DATEPART(MONTH, DategivenFirstDose)) as cumulative'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ageLV>=18 and ARTOutcome=\'V\' and (DategivenFirstDose >= (DATEADD(MONTH, -12, GETDATE())))');

        if (query.county) {
            cumulativeWhoReceivedOneDose.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            cumulativeWhoReceivedOneDose.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            cumulativeWhoReceivedOneDose.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            cumulativeWhoReceivedOneDose.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await cumulativeWhoReceivedOneDose
            .groupBy('DATENAME(Month,DategivenFirstDose), DATENAME(YEAR,DategivenFirstDose), DATEPART(MONTH, DategivenFirstDose)')
            .orderBy('DATEPART(MONTH, DategivenFirstDose)')
            .getRawMany();
    }
}
