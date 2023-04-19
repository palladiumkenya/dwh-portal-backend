import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsKnowledgeHivStatusCascadeQuery } from '../impl/get-pns-knowledge-hiv-status-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSKnowledgeHivStatus } from '../../entities/fact-pns-knowledge-hiv-status.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsKnowledgeHivStatusCascadeQuery)
export class GetPnsKnowledgeHivStatusCascadeHandler implements IQueryHandler<GetPnsKnowledgeHivStatusCascadeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ) {

    }

    async execute(query: GetPnsKnowledgeHivStatusCascadeQuery): Promise<any> {
        let pnsKnowledgeHivStatusCascade = `Select 
                Sum(Case WHEN PatientPKHash is not null then 1 ELSE 0 End) elicited,
                SUM(Tested)   tested,
                
                sum(Case WHEN FinalTestResult = 'Positive' then 1 ELSE 0 End ) positive,
                SUM(Case WHEN (ReportedCCCNumber  is not null) then 1 ELSE 0 End ) linked,
								SUM(Case  WHEN (FinalTestResult='Positive' ) then 1 ELSE 0 End)  newPositives,
								SUM(Case WHEN (FinalTestResult ='Negative' ) then 1 ELSE 0 End)  newNegatives,
								SUM(Case WHEN (KnowledgeOfHivStatus='Unknown' or KnowledgeOfHivStatus='1067') then 1 ELSE 0 End)  unknownStatus,
                
                SUM(Case WHEN (KnowledgeOfHivStatus='Positive') then 1 ELSE 0 End)  knownPositive
            From NDWH.dbo.FactHTSPartnerNotificationServices pns
            LEFT JOIN NDWH.dbo.FactHTSClientTests test on test.PatientKey = pns.PatientKey
            LEFT JOIN NDWH.dbo.DimPatient pat on pns.PatientKey = pat.PatientKey
            LEFT JOIN NDWH.dbo.DimFacility f on f.FacilityKey = pns.FacilityKey
            LEFT JOIN NDWH.dbo.DimAgeGroup age on pns.AgeGroupKey = age.AgeGroupKey
            LEFT JOIN NDWH.dbo.DimAgency a on pns.AgencyKey = a.AgencyKey
            LEFT JOIN NDWH.dbo.DimPartner p on pns.PartnerKey = p.PartnerKey
            Where MFLCode is not Null`;
        // this.repository.createQueryBuilder('q')
        //     .select(['SUM(q.ContactElicited) elicited, SUM(q.ContactTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive, SUM(q.NewNegatives) newNegatives, SUM(q.NewPositives) newPositives, SUM(q.UnknownStatus) unknownStatus'])
        //     .where('q.Mflcode IS NOT NULL');

        if (query.county) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.agency) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and agencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if(query.project) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2)) >= ${query.fromDate}`;
        }

        if (query.toDate) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and CONCAT(year(DateTestedKey), RIGHT('00' + CONVERT(VARCHAR(2), month(DateTestedKey)), 2))<= ${query.toDate}`;
        }

        return await this.repository.query(
            pnsKnowledgeHivStatusCascade,
            [],
        );
    }
}
