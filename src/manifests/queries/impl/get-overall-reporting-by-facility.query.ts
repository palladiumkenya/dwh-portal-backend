export class GetOverallReportingByFacilityQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;
    period?: string;
    reportingType?: string;

    constructor(public docket: string) {
        
    }
}
