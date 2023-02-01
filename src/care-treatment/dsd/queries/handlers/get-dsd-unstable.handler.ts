import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdUnstableQuery } from '../impl/get-dsd-unstable.query';
import { AggregateDSDUnstable } from '../../entities/AggregateDSDUnstable.model';

@QueryHandler(GetDsdUnstableQuery)
export class GetDsdUnstableHandler
    implements IQueryHandler<GetDsdUnstableQuery> {
    constructor(
        @InjectRepository(AggregateDSDUnstable, 'mssql')
        private readonly repository: Repository<AggregateDSDUnstable>,
    ) {}

    async execute(query: GetDsdUnstableQuery): Promise<any> {
        const dsdUnstable = this.repository
            .createQueryBuilder('f')
            .select([
                'SUM([patients_number]) txCurr, SUM([onARTlessthan12mnths]) onArtLessThan12Months, SUM([Agelessthan20Yrs]) ageLessThan20Years, SUM([Adherence]) poorAdherence, SUM([HighVL]) highVl, SUM([BMI]) bmiLessThan18, SUM(LatestPregnancy) latestPregnancy',
            ])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdUnstable.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            dsdUnstable.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            dsdUnstable.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            dsdUnstable.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            dsdUnstable.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            dsdUnstable.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        // lacking gender
        if (query.gender) {
            dsdUnstable.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdUnstable.getRawOne();
    }
}
