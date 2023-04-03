import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByAgeSexQuery } from '../impl/get-pns-sexual-contacts-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByAgeSexQuery)
export class GetPnsSexualContactsByAgeSexHandler implements IQueryHandler<GetPnsSexualContactsByAgeSexQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ) {

    }

    async execute(query: GetPnsSexualContactsByAgeSexQuery): Promise<any> {
        let pnsSexualContactsByAgeSex = `Select DATIMAgegroup age,
                Gender gender,
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
        //     .select(['q.Agegroup age, q.Gender gender, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.Agegroup IS NOT NULL')
        //     .andWhere('q.Gender IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByAgeSex.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByAgeSex.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} GROUP BY Gender, DATIMAgegroup`;

        pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} ORDER BY DATIMAgegroup, Gender`;


        return await this.repository.query(
            pnsSexualContactsByAgeSex,
            [],
        )
    }
}
