export class GetRecencyByPartnerQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;
    period?: string;

    constructor(public docket: string) {
        
    }
}
