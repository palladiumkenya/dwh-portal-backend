import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery } from '../impl/get-covid-trends-of-adult-plhiv-vaccination-in-the-last-12-months.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret Error: Arithmetic overflow error converting expression to data type datetime.
@QueryHandler(GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery)
export class GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsHandler implements IQueryHandler<GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery): Promise<any> {
        const trendsOfPLHIVVaccination = this.repository.createQueryBuilder('g')
            .select(['DATENAME(Month,g.DateGivenFirstDoseKey) AS DategivenFirstDose,DATENAME(YEAR,g.DateGivenFirstDoseKey) AS YearFirstDose, count (*)Num, g.VaccinationStatus'])
          
            .where('(g.DateGivenFirstDoseKey >= (DATEADD(MONTH, -12, GETDATE())))');

        if (query.county) {
            trendsOfPLHIVVaccination.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            trendsOfPLHIVVaccination.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            trendsOfPLHIVVaccination.andWhere('g.FacilityName IN (:...facilities)', { facilities: query.facility });
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
            trendsOfPLHIVVaccination.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await trendsOfPLHIVVaccination
            .groupBy('DATENAME(Month,g.DateGivenFirstDoseKey), DATENAME(YEAR,g.DateGivenFirstDoseKey),  DATEPART(YEAR, g.DateGivenFirstDoseKey), DATEPART(MONTH, g.DateGivenFirstDoseKey), g.VaccinationStatus')
            .orderBy('DATEPART(YEAR, g.DateGivenFirstDoseKey), DATEPART(MONTH, g.DateGivenFirstDoseKey)')
            .getRawMany();
    }
}
