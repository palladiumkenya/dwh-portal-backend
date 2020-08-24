export class GetTrendsConsistencyQuery {
    county?: string;
    agency?: string;
    partner?: string;

    constructor (
        public docket: string,
        public startDate = `${new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())}`,
        public endDate = `${new Date()}`
    ) {

    }
}
