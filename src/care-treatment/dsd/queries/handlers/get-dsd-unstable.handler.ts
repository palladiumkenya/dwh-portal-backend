import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdUnstable } from '../../entities/fact-trans-dsd-unstable.model';
import { Repository } from 'typeorm';
import { GetDsdUnstableQuery } from '../impl/get-dsd-unstable.query';

@QueryHandler(GetDsdUnstableQuery)
export class GetDsdUnstableHandler implements IQueryHandler<GetDsdUnstableQuery> {
    constructor(
        @InjectRepository(FactTransDsdUnstable, 'mssql')
        private readonly repository: Repository<FactTransDsdUnstable>
    ) {

    }

    async execute(query: GetDsdUnstableQuery): Promise<any> {
        const dsdUnstable = this.repository.createQueryBuilder('f')
            .select(['SUM([TxCurr]) txCurr, SUM([onARTlessthan12mnths]) onArtLessThan12Months, SUM([Agelessthan20Yrs]) ageLessThan20Years, SUM([Adherence]) poorAdherence, SUM([HighVL]) highVl, SUM([BMI]) bmiLessThan18, SUM(LatestPregnancy) latestPregnancy'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdUnstable.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdUnstable.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdUnstable.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdUnstable.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdUnstable.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await dsdUnstable.getRawOne();
    }
}
