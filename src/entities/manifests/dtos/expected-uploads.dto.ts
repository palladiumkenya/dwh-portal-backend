export class ExpectedUploadsDto {
    county: string;
    agency: string;
    partner: string;
    docket: string;
    expected: number;

    constructor(county: string, agency: string, partner: string, docket: string, expected: number) {
        this.county = county;
        this.agency = agency;
        this.partner = partner;
        this.docket = docket;
        this.expected = expected;
    }
}
