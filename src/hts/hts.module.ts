import { Module } from '@nestjs/common';
import { HtsController } from './hts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FactHtsUptake } from './uptake/entities/fact-htsuptake.entity';
import { FactHtsUptakeAgeGender } from './uptake/entities/fact-htsuptake-agegender.entity';
import { FactHtsPopulationType } from './uptake/entities/fact-hts-populationtype.entity';
import { FactHtsTeststrategy } from './uptake/entities/fact-hts-teststrategy.entity';
import { FactHtsEntryPoint } from './uptake/entities/fact-hts-entrypoint.entity';
import { FactHtsClientTestedAs } from './uptake/entities/fact-hts-clienttestedas.entity';
import { FactHtsMonthsLastTest } from './uptake/entities/fact-hts-monthslasttest.entity';
import { FactHtsTBScreening } from './uptake/entities/fact-hts-tbscreening.entity';
import { FactHtsClientSelfTested } from './uptake/entities/fact-hts-clientselftested.entity';
import { FactHtsuptake } from './pns/entities/fact-htsuptake.entity';
import { FactPNSSexualPartner } from './pns/entities/fact-pns-sexual-partner.entity';
import { FactPNSChildren } from './pns/entities/fact-pns-children.entity';

import { GetHtsCountiesHandler } from './common/queries/handlers/get-hts-counties.handler';
import { GetHtsSubCountiesHandler } from './common/queries/handlers/get-hts-sub-counties.handler';
import { GetHtsFacilitiesHandler } from './common/queries/handlers/get-hts-facilities.handler';
import { GetHtsPartnersHandler } from './common/queries/handlers/get-hts-partners.handler';
import { GetHtsAgenciesHandler } from './common/queries/handlers/get-hts-agencies.handler';
import { GetHtsProjectsHandler } from './common/queries/handlers/get-hts-projects.handler';

import { GetNumberTestedPositivityHandler } from './uptake/queries/handlers/get-number-tested-positivity.handler';
import { GetUptakeByAgeSexHandler } from './uptake/queries/handlers/get-uptake-by-age-sex.handler';
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
import { GetLinkageByPopulationTypeHandler } from './linkage/queries/handlers/get-linkage-by-population-type.handler';
import { GetLinkageByCountyHandler } from './linkage/queries/handlers/get-linkage-by-county.handler';
import { GetLinkageByPartnerHandler } from './linkage/queries/handlers/get-linkage-by-partner.handler';
import { GetLinkageByEntryPointHandler } from './linkage/queries/handlers/get-linkage-by-entry-point.handler';
import { GetLinkageByStrategyHandler } from './linkage/queries/handlers/get-linkage-by-strategy.handler';

import { GetPnsSexualContactsCascadeHandler } from './pns/queries/handlers/get-pns-sexual-contacts-cascade.handler';
import { GetPnsSexualContactsByAgeSexHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-age-sex.handler';
import { GetPnsSexualContactsByCountyHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-county.handler';
import { GetPnsSexualContactsByPartnerHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-partner.handler';
import { GetPnsSexualContactsByYearHandler } from './pns/queries/handlers/get-pns-sexual-contacts-by-year.handler';
import { GetPnsChildrenCascadeHandler } from './pns/queries/handlers/get-pns-children-cascade.handler';
import { GetPnsChildrenByYearHandler } from './pns/queries/handlers/get-pns-children-by-year.handler';
import { GetPnsIndexHandler } from './pns/queries/handlers/get-pns-index.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([
            FactHtsUptake,
            FactHtsUptakeAgeGender,
            FactHtsPopulationType,
            FactHtsTeststrategy,
            FactHtsEntryPoint,
            FactHtsClientTestedAs,
            FactHtsClientSelfTested,
            FactHtsMonthsLastTest,
            FactHtsTBScreening,
            FactPNSSexualPartner,
            FactPNSChildren,
            FactHtsuptake,
        ])
    ],
    providers: [
        GetHtsCountiesHandler,
        GetHtsSubCountiesHandler,
        GetHtsFacilitiesHandler,
        GetHtsPartnersHandler,
        GetHtsAgenciesHandler,
        GetHtsProjectsHandler,

        GetNumberTestedPositivityHandler,
        GetUptakeByAgeSexHandler,
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
        GetLinkageByPopulationTypeHandler,
        GetLinkageByCountyHandler,
        GetLinkageByPartnerHandler,
        GetLinkageByEntryPointHandler,
        GetLinkageByStrategyHandler,

        GetPnsSexualContactsCascadeHandler,
        GetPnsSexualContactsByAgeSexHandler,
        GetPnsSexualContactsByCountyHandler,
        GetPnsSexualContactsByPartnerHandler,
        GetPnsSexualContactsByYearHandler,
        GetPnsChildrenCascadeHandler,
        GetPnsChildrenByYearHandler,
        GetPnsIndexHandler,
    ],
    controllers: [HtsController]
})

export class HtsModule {}
