export class GetTilesQuery {
    county?: string;
    agency?: string;
    partner?: string;

    constructor(public readonly docket: string,
                public readonly year: number,
                public readonly month: number) {
        this.docket = docket;
        this.month = month;
        this.year = year;
    }
}
