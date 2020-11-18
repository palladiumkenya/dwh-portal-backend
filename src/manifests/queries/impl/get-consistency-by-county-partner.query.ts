export class GetConsistencyByCountyPartnerQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;
    reportingType?: string;

    constructor(public docket: string, public period = `${new Date().getFullYear()},${new Date().getMonth()}`) {
        
    }

    getDatePeriod(): string {
        const year = this.period.split(',')[0];
        const month = this.period.split(',')[1];
        return new Date(+year, +month, 1).toISOString().slice(0, 10);
    }
}
