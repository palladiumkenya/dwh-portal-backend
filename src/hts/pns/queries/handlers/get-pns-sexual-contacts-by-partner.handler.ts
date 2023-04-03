import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByPartnerQuery } from '../impl/get-pns-sexual-contacts-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByPartnerQuery)
export class GetPnsSexualContactsByPartnerHandler
    implements IQueryHandler<GetPnsSexualContactsByPartnerQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsSexualContactsByPartnerQuery): Promise<any> {
        let pnsSexualContactsByPartner = `Select PartnerName partner,
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
        //     .select(['q.CTPartner partner, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.CTPartner IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByPartner.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByPartner.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} GROUP BY PartnerName`;

        pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} ORDER BY SUM(tested) DESC`;

        return await this.repository.query(pnsSexualContactsByPartner, []);

        // return await pnsSexualContactsByPartner
        //     .groupBy('q.CTPartner')
        //     .orderBy('SUM(q.PartnerTested)', 'DESC')
        //     .getRawMany();
    }
}
