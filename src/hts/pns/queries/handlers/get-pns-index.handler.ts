import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsIndexQuery } from '../impl/get-pns-index.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsuptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsIndexQuery)
export class GetPnsIndexHandler implements IQueryHandler<GetPnsIndexQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsIndexQuery): Promise<any> {
        let params = [];
        let pnsIndex = `SELECT 
                Count(*) indexClients
            FROM 
                NDWH.[dbo].[FactHTSPartnerNotificationServices] link
                LEFT JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                LEFT JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                LEFT JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                LEFT JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                LEFT JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
                LEFT JOIN NDWH.dbo.FactHTSClientTests test on test.PatientKey = link.PatientKey
            WHERE FinalTestResult = 'Positive'`;

        if (query.county) {
            pnsIndex = `${pnsIndex}  and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsIndex = `${pnsIndex} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsIndex = `${pnsIndex} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsIndex = `${pnsIndex} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if(query.month) {
        //     pnsIndex.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsIndex.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsIndex = `${pnsIndex}  and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            pnsIndex = `${pnsIndex}  and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        return await this.repository.query(pnsIndex, params);
    }
}
