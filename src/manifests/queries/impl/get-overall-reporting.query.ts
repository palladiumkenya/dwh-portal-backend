export class GetOverallReportingQuery {
    county?: string;
    agency?: string;
    partner?: string;
    period?: string;
    reportingType?: string;

    constructor(public docket: string) {
    }
}
