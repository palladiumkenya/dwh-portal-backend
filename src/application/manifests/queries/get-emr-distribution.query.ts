export class GetEmrDistributionQuery {
    agency?: string;
    county?: string;
    partner?: string;
    reportingType?: string;

    constructor(public docket: string) {
    }
}
