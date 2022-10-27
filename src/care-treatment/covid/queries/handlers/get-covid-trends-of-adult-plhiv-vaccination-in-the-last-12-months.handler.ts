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
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery): Promise<any> {
        const trendsOfPLHIVVaccination = this.repository.createQueryBuilder('g')
            .select(['DATENAME(Month,f.DategivenFirstDose) AS DategivenFirstDose,DATENAME(YEAR,f.DategivenFirstDose) AS YearFirstDose, count (*)Num, f.VaccinationStatus'])
            .leftJoin(FactTransCovidVaccines , 'f', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ageLV>=12 and ARTOutcome=\'V\' and (f.DategivenFirstDose >= (DATEADD(MONTH, -12, GETDATE())))');

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
            .groupBy('DATENAME(Month,f.DategivenFirstDose), DATENAME(YEAR,f.DategivenFirstDose),  DATEPART(YEAR, f.DategivenFirstDose), DATEPART(MONTH, f.DategivenFirstDose), f.VaccinationStatus')
            .orderBy('DATEPART(YEAR, f.DategivenFirstDose), DATEPART(MONTH, f.DategivenFirstDose)')
            .getRawMany();
    }
}
