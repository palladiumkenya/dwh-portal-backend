import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MetabaseService } from "./providers/metabase.service";
import { SelfServiceController } from "./self-service.controller";

@Module({
    imports: [HttpModule],
    providers: [MetabaseService],
    controllers: [SelfServiceController]
})
export class SelfServiceModule {}