export class GetExpectedUploadsQuery {
    county?: string;
    agency?: string;
    partner?: string;

    constructor(public docket: string) {
    }
}
