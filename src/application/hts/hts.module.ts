import { Module } from '@nestjs/common';
import { HtsController } from './controllers/hts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/hts/fact-htsuptake.entity';
import { GetNumberTestedPositivityHandler } from './queries/handlers/get-number-tested-positivity.handler';
import { GetUptakeByAgeSexHandler } from './queries/handlers/get-uptake-by-age-sex.handler';
import { FactHtsUptakeAgeGender } from '../../entities/hts/fact-htsuptake-agegender.entity';
import { FactHtsPopulationType } from '../../entities/hts/fact-hts-populationtype.entity';
import { GetUptakeByPopulationTypeHandler } from './queries/handlers/get-uptake-by-population-type.handler';
import { FactHtsTeststrategy } from '../../entities/hts/fact-hts-teststrategy.entity';
import { GetUptakeByTestingStrategyHandler } from './queries/handlers/get-uptake-by-testing-strategy.handler';
import { FactHtsEntryPoint } from '../../entities/hts/fact-hts-entrypoint.entity';
import { GetUptakeByEntrypointHandler } from './queries/handlers/get-uptake-by-entrypoint.handler';
import { GetUptakeByCountyHandler } from './queries/handlers/get-uptake-by-county.handler';
import { GetUptakeByPartnerHandler } from './queries/handlers/get-uptake-by-partner.handler';
import { FactHtsClientTestedAs } from '../../entities/hts/fact-hts-clienttestedas.entity';
import { GetUptakeByTestedasHandler } from './queries/handlers/get-uptake-by-testedas.handler';
import { FactHtsClientSelfTested } from '../../entities/hts/fact-hts-clientselftested.entity';
import { GetUptakeByClientSelfTestedHandler } from './queries/handlers/get-uptake-by-client-self-tested.handler';
import { GetUptakeCountiesHandler } from './queries/handlers/get-uptake-counties.handler';
import { GetHtsSubCountiesHandler } from './queries/handlers/get-hts-sub-counties.handler';
import { GetHtsFacilitiesHandler } from './queries/handlers/get-hts-facilities.handler';
import { GetHtsPartnersHandler } from './queries/handlers/get-hts-partners.handler';

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
          FactHtsClientSelfTested
      ])
  ],
  providers: [
      GetNumberTestedPositivityHandler,
      GetUptakeByAgeSexHandler,
      GetUptakeByPopulationTypeHandler,
      GetUptakeByTestingStrategyHandler,
      GetUptakeByEntrypointHandler,
      GetUptakeByCountyHandler,
      GetUptakeByPartnerHandler,
      GetUptakeByTestedasHandler,
      GetUptakeByClientSelfTestedHandler,
      GetUptakeCountiesHandler,
      GetHtsSubCountiesHandler,
      GetHtsFacilitiesHandler,
      GetHtsPartnersHandler
  ],
  controllers: [HtsController]
})
export class HtsModule {}
