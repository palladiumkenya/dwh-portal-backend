import moment = require('moment');

export class GetTrendsConsistencyQuery {
    county?: string[];
    subCounty?: string[];
    facility?: string[];
    partner?: string[];
    agency?: string[];
    year?: number;
    month?: number;

    constructor (
        public docket: string,
        public startDate = moment().subtract(1, 'year').startOf('month').format('YYYY-MM-DD'),
        public endDate = moment().format('YYYY-MM-DD')
    ) {

    }
}
