import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdStable } from '../../../../entities/care_treatment/fact-trans-dsd-mmd-stable.model';
import { Repository } from 'typeorm';
import { GetDsdMmdStableQuery } from '../get-dsd-mmd-stable.query';

@QueryHandler(GetDsdMmdStableQuery)
export class GetDsdMmdStableHandler implements IQueryHandler<GetDsdMmdStableQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdStable, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdStable>
    ) {

    }

    async execute(query: GetDsdMmdStableQuery): Promise<any> {
        const dsdUnstable = this.repository.createQueryBuilder('f')
            .select(['SUM([onARTlessthan12mnths]) onArtLessThan12Months, SUM([Agelessthan20Yrs]) ageLessThan20Years, SUM([Adherence]) poorAdherence, SUM([HighVL]) highVl, SUM([BMI]) bmiLessThan18'])
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

        return await dsdUnstable.getRawOne();
    }
}
