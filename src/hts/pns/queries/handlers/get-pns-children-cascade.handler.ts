import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenCascadeQuery } from '../impl/get-pns-children-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsChildrenCascadeQuery)
export class GetPnsChildrenCascadeHandler
    implements IQueryHandler<GetPnsChildrenCascadeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsChildrenCascadeQuery): Promise<any> {
        let pnsChildrenCascade = `Select 
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

            where RelationsipToIndexClient in ('Child') 
        `;

        // this.repository.createQueryBuilder('q')
        //     .select(['SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL');

        if (query.county) {
            pnsChildrenCascade = `${pnsChildrenCascade} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsChildrenCascade = `${pnsChildrenCascade} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsChildrenCascade = `${pnsChildrenCascade} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsChildrenCascade = `${pnsChildrenCascade} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsChildrenCascade = `${pnsChildrenCascade} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsChildrenCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsChildrenCascade = `${pnsChildrenCascade} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsChildrenCascade = `${pnsChildrenCascade} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        return await this.repository.query(pnsChildrenCascade, []);

        // return await pnsChildrenCascade.getRawOne();
    }
}
