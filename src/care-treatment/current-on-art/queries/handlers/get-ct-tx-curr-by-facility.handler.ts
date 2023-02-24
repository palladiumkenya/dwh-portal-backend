import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrByFacilityQuery } from '../impl/get-ct-tx-curr-by-facility.query';
import { LinelistFACTART } from './../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetCtTxCurrByFacilityQuery)
export class GetCtTxCurrByFacilityHandler
    implements IQueryHandler<GetCtTxCurrByFacilityQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetCtTxCurrByFacilityQuery): Promise<any> {
        const txCurrByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                'FacilityName, PartnerName CTPartner, County, Subcounty, AgencyName CTAgency, SiteCode MFLCode, SUM(ISTXCurr) TXCURR',
            ])
            .where(
                "f.[Gender] IS NOT NULL ",
            );

        if (query.county) {
            txCurrByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByPartner.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByPartner.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByPartner.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByPartner.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByPartner.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        //TODO:: Get ages
        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByPartner.andWhere('f.age >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByPartner.andWhere('f.age < 18');
        }

        if (query.gender) {
            txCurrByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByPartner
            .groupBy(
                'PartnerName, County, Subcounty, AgencyName, SiteCode, FacilityName',
            )
            .orderBy('SiteCode', 'DESC')
            .getRawMany();
    }
}
