export class GetEmrDistributionQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;
    reportingType?: string;
    period?: string;

    constructor(public docket: string) {
        
    }
}
