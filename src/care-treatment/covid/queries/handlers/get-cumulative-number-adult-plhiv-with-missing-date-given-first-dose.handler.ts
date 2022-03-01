import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {
    GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery
} from "../impl/get-cumulative-number-adult-plhiv-with-missing-date-given-first-dose.query";

@QueryHandler(GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery)
export class GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseHandler implements IQueryHandler<GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseQuery): Promise<any> {
        const cumulativeWhoReceivedOneDose = this.repository.createQueryBuilder('f')
            .select(['COUNT(DISTINCT CONCAT(f.PatientID, \'-\', f.PatientPK,\'-\',f.SiteCode))Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('ageLV>=15 and ARTOutcome=\'V\' and f.DateGivenFirstDose =\'0001-01-01\' and f.VaccinationStatus in (\'Fully Vaccinated\',\'Partially Vaccinated\')');

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
            .getRawOne();
    }
}
