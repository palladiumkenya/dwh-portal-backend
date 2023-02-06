import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        const cumulativeWithMissingDate = this.repository
            .createQueryBuilder('f')
            .select(['COUNT(*) Num'])
            .where(
                "f.DateGivenFirstDoseKey ='1900-01-01' and f.VaccinationStatus in ('Fully Vaccinated','Partially Vaccinated')",
            );

        if (query.county) {
            cumulativeWithMissingDate.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            cumulativeWithMissingDate.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            cumulativeWithMissingDate.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            cumulativeWithMissingDate.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            cumulativeWithMissingDate.andWhere('CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            cumulativeWithMissingDate.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            cumulativeWithMissingDate.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await cumulativeWithMissingDate
            .getRawOne();
    }
}
