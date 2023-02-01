import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrByAgeAndSexQuery } from '../impl/get-ct-tx-curr-by-age-and-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { AggregateTXCurr } from './../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrByAgeAndSexQuery)
export class GetCtTxCurrByAgeAndSexHandler
    implements IQueryHandler<GetCtTxCurrByAgeAndSexQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>,
    ) {}

    async execute(query: GetCtTxCurrByAgeAndSexQuery): Promise<any> {
        const txCurrByAgeAndSex = this.repository
            .createQueryBuilder('f')
            .select([
                'f.[DATIMAgeGroup] ageGroup, [Gender], Sum(CountClientsTXCur) txCurr',
            ]);
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            // .where(`ARTOutcome ='V' AND ageLV BETWEEN 0 and 120`);

        if (query.county) {
            txCurrByAgeAndSex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByAgeAndSex.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByAgeAndSex.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByAgeAndSex.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByAgeAndSex.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            txCurrByAgeAndSex.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByAgeAndSex.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByAgeAndSex.andWhere('f.ageLV < 18');
        }

        if (query.datimAgeGroup) {
            txCurrByAgeAndSex.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        const result = await txCurrByAgeAndSex
            .groupBy('f.[DATIMAgeGroup], [Gender]')
            .orderBy('f.[DATIMAgeGroup]')
            .getRawMany();

        const returnedVal = [];
        const groupings = [
            'Under 1',
            '1 to 4',
            '5 to 9',
            '10 to 14',
            '15 to 19',
            '20 to 24',
            '25 to 29',
            '30 to 34',
            '35 to 39',
            '40 to 44',
            '45 to 49',
            '50 to 54',
            '55 to 59',
            '60 to 64',
            '65+',
        ];
        for (let i = 0; i < groupings.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (result[j].ageGroup == groupings[i]) {
                    returnedVal.push(result[j]);
                }
            }
        }

        return returnedVal;
    }
}
