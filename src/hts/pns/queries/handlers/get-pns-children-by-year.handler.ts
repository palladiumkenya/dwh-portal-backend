import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenByYearQuery } from '../impl/get-pns-children-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsChildrenByYearQuery)
export class GetPnsChildrenByYearHandler
    implements IQueryHandler<GetPnsChildrenByYearQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsChildrenByYearQuery): Promise<any> {
        let pnsChildrenByYear = `Select year(DateTestedKey) year,
                month(DateTestedKey) month,
                Sum(Case WHEN PatientPK is not null then 1 ELSE 0 End) elicited,
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

            where RelationsipToIndexClient in ('Child') 
            `;
        // this.repository.createQueryBuilder('q')
        //     .select(['q.year, q.month, SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.year IS NOT NULL')
        //     .andWhere('q.month IS NOT NULL');

        if (query.county) {
            pnsChildrenByYear = `${pnsChildrenByYear} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsChildrenByYear = `${pnsChildrenByYear} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsChildrenByYear = `${pnsChildrenByYear} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsChildrenByYear = `${pnsChildrenByYear} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsChildrenByYear = `${pnsChildrenByYear} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsChildrenByYear.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenByYear.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsChildrenByYear = `${pnsChildrenByYear} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsChildrenByYear = `${pnsChildrenByYear} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        pnsChildrenByYear = `${pnsChildrenByYear} GROUP BY year(DateTestedKey), month(DateTestedKey)`;

        pnsChildrenByYear = `${pnsChildrenByYear} ORDER BY year(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(pnsChildrenByYear, []);
        // return await pnsChildrenByYear
        //     .groupBy('q.year, q.month')
        //     .orderBy('q.year, q.month')
        //     .getRawMany();
    }
}
