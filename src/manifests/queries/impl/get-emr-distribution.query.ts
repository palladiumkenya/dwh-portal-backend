export class GetEmrDistributionQuery {
    agency?: string;
    county?: string;
    partner?: string;
    reportingType?: string;
    period?: string;

    constructor(public docket: string) {
    }
}
