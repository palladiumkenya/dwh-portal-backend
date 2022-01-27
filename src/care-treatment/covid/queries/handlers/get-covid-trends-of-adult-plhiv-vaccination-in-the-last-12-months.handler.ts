import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery } from '../impl/get-covid-trends-of-adult-plhiv-vaccination-in-the-last-12-months.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery)
export class GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsHandler implements IQueryHandler<GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery): Promise<any> {
        const trendsOfPLHIVVaccination = this.repository.createQueryBuilder('f')
            .select(['DATENAME(Month,DategivenFirstDose) AS DategivenFirstDose,DATENAME(YEAR,DategivenFirstDose) AS YearFirstDose, count (*)Num, VaccinationStatus'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ageLV>=18 and ARTOutcome=\'V\' and (DategivenFirstDose >= (DATEADD(MONTH, -12, GETDATE())))');

        if (query.county) {
            trendsOfPLHIVVaccination.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            trendsOfPLHIVVaccination.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            trendsOfPLHIVVaccination.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            trendsOfPLHIVVaccination.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            trendsOfPLHIVVaccination.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            trendsOfPLHIVVaccination.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            trendsOfPLHIVVaccination.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await trendsOfPLHIVVaccination
            .groupBy('DATENAME(Month,DategivenFirstDose), DATENAME(YEAR,DategivenFirstDose),  DATEPART(YEAR, DategivenFirstDose), DATEPART(MONTH, DategivenFirstDose), VaccinationStatus')
            .orderBy(' DATEPART(YEAR, DategivenFirstDose), DATEPART(MONTH, DategivenFirstDose)')
            .getRawMany();
    }
}
