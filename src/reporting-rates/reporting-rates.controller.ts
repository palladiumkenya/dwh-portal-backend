import { Controller, Get } from '@nestjs/common';
import { ReportingRatesService } from './reporting-rates.service';

@Controller('reportingrates')
export class ReportingRatesController {
    constructor(private reportingService: ReportingRatesService) {}

    @Get('/getcounties')
    getCounties() {
        return this.reportingService.getCounties();
    }
}
