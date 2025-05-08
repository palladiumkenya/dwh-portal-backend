export class GetEMRInfoQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;
    reportingType?: string;

    constructor(public docket: string) {}
}
