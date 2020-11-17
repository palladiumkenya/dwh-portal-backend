export class TrendDto {
    docket: string;
    expected: number;
    trend: number;
    trendPerc: number;
    year: number;
    month: number;
    monthName: number;

    constructor(docket: string, expected: number) {
        this.docket = docket;
        this.expected = expected;
    }

    setTrend(trend: number, trendYear: number, trendMonth: number, trendMonthName: number) {
        this.trend = trend;
        this.trendPerc = (trend / this.expected) * 100;
        this.year = trendYear;
        this.month = trendMonth;
        this.monthName = trendMonthName;
    }
}
