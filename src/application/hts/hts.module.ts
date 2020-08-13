import { Module } from '@nestjs/common';
import { HtsController } from './controllers/hts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/hts/fact-htsuptake.entity';
import { GetNumberTestedPositivityHandler } from './queries/handlers/get-number-tested-positivity.handler';

@Module({
  imports: [
      CqrsModule,
      ConfigurationModule,
      TypeOrmModule.forFeature([FactHtsUptake])
  ],
  providers: [
      GetNumberTestedPositivityHandler
  ],
  controllers: [HtsController]
})
export class HtsModule {}
