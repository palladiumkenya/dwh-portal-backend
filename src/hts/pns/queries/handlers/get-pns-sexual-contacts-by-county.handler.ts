import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByCountyQuery } from '../impl/get-pns-sexual-contacts-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByCountyQuery)
export class GetPnsSexualContactsByCountyHandler implements IQueryHandler<GetPnsSexualContactsByCountyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ) {

    }

    async execute(query: GetPnsSexualContactsByCountyQuery): Promise<any> {
        let pnsSexualContactsByCounty = `Select County county,
                Sum(Case WHEN PatientPKHash is not null then 1 ELSE 0 End) elicited,
                SUM(Tested)   tested,
                
                sum(Case WHEN FinalTestResult = 'Positive' then 1 ELSE 0 End ) positive,
                SUM(Case WHEN (ReportedCCCNumber  is not null) then 1 ELSE 0 End ) linked,
                
                SUM(Case WHEN (KnowledgeOfHivStatus='Positive') then 1 ELSE 0 End)  knownPositive
            From NDWH.dbo.FactHTSPartnerNotificationServices pns
            LEFT JOIN NDWH.dbo.FactHTSClientTests test on test.PatientKey = pns.PatientKey
            LEFT JOIN NDWH.dbo.DimPatient pat on pns.PatientKey = pat.PatientKey
            LEFT JOIN NDWH.dbo.DimFacility f on f.FacilityKey = pns.FacilityKey
            LEFT JOIN NDWH.dbo.DimAgeGroup age on pns.AgeGroupKey = age.AgeGroupKey
            LEFT JOIN NDWH.dbo.DimAgency a on pns.AgencyKey = a.AgencyKey
            LEFT JOIN NDWH.dbo.DimPartner p on pns.PartnerKey = p.PartnerKey

            where RelationsipToIndexClient in ('Partner','Spouse','Co-Wife','cowife','Sexual Partner','Sexual Network')
            `;
        
        // this.repository.createQueryBuilder('q')
        //     .select(['q.County county, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.County IS NOT NULL');

        
        if (query.county) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.project) {
        //     pnsSexualContactsByCounty.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     pnsSexualContactsByCounty.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByCounty.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} GROUP BY County`;

        pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} ORDER BY SUM(Tested) Desc`;

        return await this.repository.query(pnsSexualContactsByCounty, []);
    }
}
