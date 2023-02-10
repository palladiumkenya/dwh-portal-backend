import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactCTTimeToArt } from '../../entities/fact-ct-time-to-art-grp.model';
import { Repository } from 'typeorm';
import { GetTimeToArtQuery } from '../impl/get-time-to-art.query';
import { AggregateTimeToARTGrp } from './../../entities/aggregate-time-to-art-grp.model';

@QueryHandler(GetTimeToArtQuery)
export class GetTimeToArtHandler implements IQueryHandler<GetTimeToArtQuery> {
    constructor(
        @InjectRepository(AggregateTimeToARTGrp, 'mssql')
        private readonly repository: Repository<AggregateTimeToARTGrp>,
    ) {}
//TODO:: Add time to diagnosis Grp to agg
    async execute(query: GetTimeToArtQuery): Promise<any> {
        const timeToArt = this.repository
            .createQueryBuilder('f')
            .select([
                '[StartARTYear] year, [TimeToARTDiagnosis_Grp] period, SUM([NumPatients]) txNew',
            ])
            .where('f.[NumPatients] > 0')
            .andWhere('f.[TimeToARTDiagnosis_Grp] IS NOT NULL');

        if (query.county) {
            timeToArt.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            timeToArt.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            timeToArt.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            timeToArt.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            timeToArt.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            timeToArt.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            timeToArt.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        timeToArt.andWhere('f.StartARTYear >= :startYear', {
            startYear: 2011,
        });

        return await timeToArt
            .groupBy('f.[StartARTYear], f.[TimeToARTDiagnosis_Grp]')
            .orderBy('f.[StartARTYear], f.[TimeToARTDiagnosis_Grp]')
            .getRawMany();
    }
}
