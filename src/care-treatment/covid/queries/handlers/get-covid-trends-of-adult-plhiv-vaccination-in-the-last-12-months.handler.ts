import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery } from '../impl/get-covid-trends-of-adult-plhiv-vaccination-in-the-last-12-months.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from './../../entities/linelist-covid.model';
//Margaret
@QueryHandler(GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery)
export class GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsHandler implements IQueryHandler<GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsQuery): Promise<any> {
        const trendsOfPLHIVVaccination = this.repository
            .createQueryBuilder('g')
            .select([
                'DATENAME(Month,DateGivenFirstDoseKey) AS DategivenFirstDose,DATENAME(YEAR,DateGivenFirstDoseKey) AS YearFirstDose, count (*)Num, VaccinationStatus',
            ])
            .where(
                '(DateGivenFirstDoseKey >= (DATEADD(MONTH, -12, GETDATE())))',
            );

        if (query.county) {
            trendsOfPLHIVVaccination.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            trendsOfPLHIVVaccination.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            trendsOfPLHIVVaccination.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            trendsOfPLHIVVaccination.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            trendsOfPLHIVVaccination.andWhere('CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            trendsOfPLHIVVaccination.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            trendsOfPLHIVVaccination.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await trendsOfPLHIVVaccination
            .groupBy(
                'DATENAME(Month,DateGivenFirstDoseKey), DATENAME(YEAR,DateGivenFirstDoseKey),  DATEPART(YEAR, DateGivenFirstDoseKey), DATEPART(MONTH, DateGivenFirstDoseKey), VaccinationStatus',
            )
            .orderBy(
                'DATEPART(YEAR, DateGivenFirstDoseKey), DATEPART(MONTH, DateGivenFirstDoseKey)',
            )
            .getRawMany();
    }
}
