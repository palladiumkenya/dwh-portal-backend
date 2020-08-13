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

@Module({
  imports: [
      CqrsModule,
      ConfigurationModule,
      TypeOrmModule.forFeature([
          FactHtsUptake,
          FactHtsUptakeAgeGender,
          FactHtsPopulationType,
          FactHtsTeststrategy,
          FactHtsEntryPoint
      ])
  ],
  providers: [
      GetNumberTestedPositivityHandler,
      GetUptakeByAgeSexHandler,
      GetUptakeByPopulationTypeHandler,
      GetUptakeByTestingStrategyHandler,
      GetUptakeByEntrypointHandler
  ],
  controllers: [HtsController]
})
export class HtsModule {}
