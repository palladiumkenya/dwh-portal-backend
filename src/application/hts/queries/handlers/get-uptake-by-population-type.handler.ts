import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPopulationTypeQuery } from '../get-uptake-by-population-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsPopulationType } from '../../../../entities/hts/fact-hts-populationtype.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByPopulationTypeQuery)
export class GetUptakeByPopulationTypeHandler implements IQueryHandler<GetUptakeByPopulationTypeQuery> {
    constructor(
        @InjectRepository(FactHtsPopulationType)
        private readonly repository: Repository<FactHtsPopulationType>
    ){}

    async execute(query: GetUptakeByPopulationTypeQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = 'SELECT \n' +
            '`PopulationType` AS PopulationType,\n' +
            'SUM(`Tested`) Tested\n' +
            '\n' +
            'FROM `fact_hts_populationtype` \n' +
            'WHERE `PopulationType` IS NOT NULL ';

        if(query.county) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.month) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and FacilityName=?`;
            params.push(query.facility);
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY PopulationType`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }

}
