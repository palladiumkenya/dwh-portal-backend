import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByYearQuery } from '../impl/get-pns-sexual-contacts-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByYearQuery)
export class GetPnsSexualContactsByYearHandler
    implements IQueryHandler<GetPnsSexualContactsByYearQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsSexualContactsByYearQuery): Promise<any> {
        let pnsSexualContactsByYear = `Select year(DateTestedKey) year,
                month(DateTestedKey) month,
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
        //     .select(['q.year, q.month, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.year IS NOT NULL')
        //     .andWhere('q.month IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByYear = `${pnsSexualContactsByYear} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByYear.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByYear.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        pnsSexualContactsByYear = `${pnsSexualContactsByYear} GROUP BY year(DateTestedKey), month(DateTestedKey)`;

        pnsSexualContactsByYear = `${pnsSexualContactsByYear} ORDER BY year(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(pnsSexualContactsByYear, []);
    }
}
