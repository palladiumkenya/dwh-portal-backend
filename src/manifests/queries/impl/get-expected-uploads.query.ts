export class GetExpectedUploadsQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;

    constructor(public docket: string) {
        
    }
}
