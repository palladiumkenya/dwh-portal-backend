import { Module } from '@nestjs/common';
import { HtsController } from './hts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';


import { FactPrep } from './prep/entities/fact-prep.model';
import { AggregateHTSUptake } from './uptake/entities/aggregate-hts-uptake.model'
import { AllEmrSites } from '../care-treatment/common/entities/all-emr-sites.model';

import { GetHtsCountiesHandler } from './common/queries/handlers/get-hts-counties.handler';
import { GetHtsSubCountiesHandler } from './common/queries/handlers/get-hts-sub-counties.handler';
import { GetHtsFacilitiesHandler } from './common/queries/handlers/get-hts-facilities.handler';
import { GetHtsPartnersHandler } from './common/queries/handlers/get-hts-partners.handler';
import { GetHtsAgenciesHandler } from './common/queries/handlers/get-hts-agencies.handler';
import { GetHtsProjectsHandler } from './common/queries/handlers/get-hts-projects.handler';
import { GetHtsSitesHandler } from './common/queries/handlers/get-hts-sites.handler';

import { GetNumberTestedPositivityHandler } from './uptake/queries/handlers/get-number-tested-positivity.handler';
import { GetUptakeByAgeSexHandler } from './uptake/queries/handlers/get-uptake-by-age-sex.handler';
import { GetUptakeBySexHandler } from './uptake/queries/handlers/get-uptake-by-sex.handler';
import { GetUptakeByPopulationTypeHandler } from './uptake/queries/handlers/get-uptake-by-population-type.handler';
import { GetUptakeByTestingStrategyHandler } from './uptake/queries/handlers/get-uptake-by-testing-strategy.handler';
import { GetUptakeByEntrypointHandler } from './uptake/queries/handlers/get-uptake-by-entrypoint.handler';
import { GetUptakeByCountyHandler } from './uptake/queries/handlers/get-uptake-by-county.handler';
import { GetUptakeByPartnerHandler } from './uptake/queries/handlers/get-uptake-by-partner.handler';
import { GetUptakeByTestedasHandler } from './uptake/queries/handlers/get-uptake-by-testedas.handler';
import { GetUptakeByClientSelfTestedHandler } from './uptake/queries/handlers/get-uptake-by-client-self-tested.handler';
import { GetUptakeByMonthsSinceLastTestHandler } from './uptake/queries/handlers/get-uptake-by-months-since-last-test.handler';
import { GetUptakeByPositivityHandler } from './uptake/queries/handlers/get-uptake-by-positivity.handler';
import { GetUptakeByTBScreeningHandler } from './uptake/queries/handlers/get-uptake-by-tb-screening.handler';
import { GetUptakeByTbScreenedHandler } from './uptake/queries/handlers/get-uptake-by-tb-screened.handler';
import { GetUptakeByAgeSexPositivityHandler } from './uptake/queries/handlers/get-uptake-by-age-sex-positivity.handler';

import { GetLinkageNumberPositiveHandler } from './linkage/queries/handlers/get-linkage-number-positive.handler';
import { GetLinkageNumberPositiveByTypeHandler } from './linkage/queries/handlers/get-linkage-number-positive-by-type.handler';
import { GetLinkageByAgeSexHandler } from './linkage/queries/handlers/get-linkage-by-age-sex.handler';
import { GetLinkageBySexHandler } from './linkage/queries/handlers/get-linkage-by-sex.handler';
import { GetLinkageByCountyHandler } from './linkage/queries/handlers/get-linkage-by-county.handler';
import { GetLinkageByPartnerHandler } from './linkage/queries/handlers/get-linkage-by-partner.handler';
import { GetLinkageByEntryPointHandler } from './linkage/queries/handlers/get-linkage-by-entry-point.handler';
import { GetLinkageByStrategyHandler } from './linkage/queries/handlers/get-linkage-by-strategy.handler';
import { GetLinkageNumberNotLinkedByFacilityHandler } from './linkage/queries/handlers/get-linkage-number-not-linked-by-facility.handler';

import { GetPnsSexualContactsCascadeHandler } from './pns/queries/handlers/get-pns-sexual-contacts-cascade.handler';
import { GetPnsSexualContactsByAgeSexHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-age-sex.handler';
import { GetPnsSexualContactsByCountyHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-county.handler';
import { GetPnsSexualContactsByPartnerHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-partner.handler';
import { GetPnsSexualContactsByYearHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-year.handler';
import { GetPnsChildrenCascadeHandler } from './pns/queries/handlers/get-pns-children-cascade.handler';
import { GetPnsChildrenByYearHandler } from './pns/queries/handlers/get-pns-children-by-year.handler';
import { GetPnsIndexHandler } from './pns/queries/handlers/get-pns-index.handler';
import { GetPnsKnowledgeHivStatusCascadeHandler } from './pns/queries/handlers/get-pns-knowledge-hiv-status-cascade.handler';

import { GetNewOnPrepHandler } from './prep/queries/handlers/get-new-on-prep.handler';
import { GetPrepDiscontinuationHandler } from './prep/queries/handlers/get-prep-discontinuation';
import { GetPrepDiscontinuationReasonHandler } from './prep/queries/handlers/get-prep-discontinuation-reason';
import { GetNewOnPrepByAgeSexHandler } from './prep/queries/handlers/get-new-on-prep-by-age-sex.handler';
import { GetNewOnPrepTrendsHandler } from './prep/queries/handlers/get-new-on-prep-trends.handler';
import { GetPrepEligibleTrendsHandler } from './prep/queries/handlers/get-prep-eligible-trends.handler';
import { GetCTPrepHandler } from './prep/queries/handlers/get-ct-prep.handler';
import { GetPrepScreenedTrendsHandler } from './prep/queries/handlers/get-prep-screened-trends.handler';
import { GetPrepEligibleByAgegroupHandler } from './prep/queries/handlers/get-prep-eligible-by-agegroup.handler';
import { GetPrepSTIScreenedOutcomeHandler } from './prep/queries/handlers/get-prep-sti-screening-outcome.handler';
import { GetPrepSTITreatmentOutcomeHandler } from './prep/queries/handlers/get-prep-sti-Treatment-outcome.handler';
import { GetPrepDiscontinuationTrendHandler } from './prep/queries/handlers/get-prep-discontinuation-trends.handler';
import { GetCTPrepTrendHandler } from './prep/queries/handlers/get-ct-prep-trends.handler';
import { GetPrepTotalTestedHandler } from './prep/queries/handlers/get-prep-total-tested.handler';
import { GetPrepTotalTestedTrendsHandler } from './prep/queries/handlers/get-prep-total-tested-trends.handler';
import { GetPrepAgeSexTrendHandler } from './prep/queries/handlers/get-prep-age-sex-trends.handler';
import { GetPrepTotalTestedAgeSexTrendsmonth1Handler } from './prep/queries/handlers/get-prep-total-tested-age-sex-trends-months1.handler';
import { GetPrepTotalTestedAgeSexTrendsmonth3Handler } from './prep/queries/handlers/get-prep-total-tested-age-sex-trends-months3.handler';
import { GetPrepRefillMonth1Handler } from './prep/queries/handlers/get-prep-refill-month1.handler';
import { GetPrepRefillMonth3Handler } from './prep/queries/handlers/get-prep-refill-month3.handler';
import { GetPrepRefillAgeSexTrendsmonth1Handler } from './prep/queries/handlers/get-prep-refilll-age-sex-trends-months1.handler';
import { GetPrepRefillAgeSexTrendsmonth3Handler } from './prep/queries/handlers/get-prep-refilll-age-sex-trends-months3.handler';
import { GetPrepSTIDiagnosedHandler } from './prep/queries/handlers/get-prep-sti-diagnosed.handler';
import { AggregateHTSEntrypoint } from './linkage/entities/aggregate-hts-entrypoint.model';
import { AggregateHTSTestStrategy } from './linkage/entities/aggregate-hts-strategy.model';
import { AggregateClientSelfTested } from './uptake/entities/aggregate-hts-client-self-tested.model';
import { AggregateHTSMonthsLastTest } from './uptake/entities/aggregate-hts-months-last-test.model';
import { AggregateClientTestedAs } from './uptake/entities/aggregate-hts-client-tested-as.model';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                AllEmrSites,
                AggregateHTSUptake,
                AggregateHTSEntrypoint,
                AggregateHTSTestStrategy,
                AggregateClientSelfTested,
                AggregateHTSMonthsLastTest,
                AggregateClientTestedAs,

                FactPrep,
            ],
            'mssql',
        ),
    ],
    providers: [
        GetHtsCountiesHandler,
        GetHtsSubCountiesHandler,
        GetHtsFacilitiesHandler,
        GetHtsPartnersHandler,
        GetHtsAgenciesHandler,
        GetHtsProjectsHandler,
        GetHtsSitesHandler,

        GetNumberTestedPositivityHandler,
        GetUptakeByAgeSexHandler,
        GetUptakeBySexHandler,
        GetUptakeByPopulationTypeHandler,
        GetUptakeByTestingStrategyHandler,
        GetUptakeByEntrypointHandler,
        GetUptakeByCountyHandler,
        GetUptakeByPartnerHandler,
        GetUptakeByTestedasHandler,
        GetUptakeByClientSelfTestedHandler,
        GetUptakeByMonthsSinceLastTestHandler,
        GetUptakeByTBScreeningHandler,
        GetUptakeByTbScreenedHandler,
        GetUptakeByAgeSexPositivityHandler,
        GetUptakeByPositivityHandler,

        GetLinkageNumberPositiveHandler,
        GetLinkageNumberPositiveByTypeHandler,
        GetLinkageByAgeSexHandler,
        GetLinkageBySexHandler,
        GetLinkageByCountyHandler,
        GetLinkageByPartnerHandler,
        GetLinkageByEntryPointHandler,
        GetLinkageByStrategyHandler,
        GetLinkageNumberNotLinkedByFacilityHandler,

        GetPnsSexualContactsCascadeHandler,
        GetPnsSexualContactsByAgeSexHandler,
        GetPnsSexualContactsByCountyHandler,
        GetPnsSexualContactsByPartnerHandler,
        GetPnsSexualContactsByYearHandler,
        GetPnsChildrenCascadeHandler,
        GetPnsChildrenByYearHandler,
        GetPnsIndexHandler,
        GetPnsKnowledgeHivStatusCascadeHandler,

        GetNewOnPrepHandler,
        GetPrepDiscontinuationHandler,
        GetPrepDiscontinuationReasonHandler,
        GetNewOnPrepByAgeSexHandler,
        GetNewOnPrepTrendsHandler,
        GetPrepEligibleTrendsHandler,
        GetPrepScreenedTrendsHandler,
        GetPrepEligibleByAgegroupHandler,
        GetCTPrepHandler,
        GetPrepSTIScreenedOutcomeHandler,
        GetPrepSTITreatmentOutcomeHandler,
        GetPrepDiscontinuationTrendHandler,
        GetCTPrepTrendHandler,
        GetPrepTotalTestedHandler,
        GetPrepTotalTestedTrendsHandler,
        GetPrepAgeSexTrendHandler,
        GetPrepTotalTestedAgeSexTrendsmonth1Handler,
        GetPrepTotalTestedAgeSexTrendsmonth3Handler,
        GetPrepRefillMonth1Handler,
        GetPrepRefillMonth3Handler,
        GetPrepRefillAgeSexTrendsmonth1Handler,
        GetPrepRefillAgeSexTrendsmonth3Handler,
        GetPrepSTIDiagnosedHandler,

    ],
    controllers: [HtsController],
})
export class HtsModule {}
