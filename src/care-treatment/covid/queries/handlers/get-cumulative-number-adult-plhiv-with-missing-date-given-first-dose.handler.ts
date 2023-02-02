import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {
    GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery
} from "../impl/get-cumulative-number-adult-plhiv-with-missing-date-given-first-dose.query";
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret Error: Conversion failed when converting the varchar value '0001-01-01' to data type int.
@QueryHandler(GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery)
export class GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseHandler implements IQueryHandler<GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery): Promise<any> {
        const cumulativeWithMissingDate = this.repository.createQueryBuilder('g')
            .select(['COUNT(DISTINCT g.MFLCode)Num'])
         
            .where('g.DateGivenFirstDoseKey =\'0001-01-01\' and g.VaccinationStatus in (\'Fully Vaccinated\',\'Partially Vaccinated\')');

        if (query.county) {
            cumulativeWithMissingDate.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            cumulativeWithMissingDate.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            cumulativeWithMissingDate.andWhere('g.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            cumulativeWithMissingDate.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            cumulativeWithMissingDate.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            cumulativeWithMissingDate.andWhere('g.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            cumulativeWithMissingDate.andWhere('g.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await cumulativeWithMissingDate
            .getRawOne();
    }
}
