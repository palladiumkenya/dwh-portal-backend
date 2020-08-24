import moment = require('moment');

export class GetTrendsConsistencyQuery {
    county?: string;
    agency?: string;
    partner?: string;

    constructor (
        public docket: string,
        public startDate = moment().subtract(1, 'year').startOf('month').format('YYYY-MM-DD'),
        public endDate = moment().format('YYYY-MM-DD')
    ) {

    }
}
