export class TileDto {
    docket: string;
    expected: number;
    overall: number;
    overallPerc: number;
    consistency: number;
    consistencyPerc: number;
    recency: number;
    recencyPerc: number;

    constructor(docket: string, expected: number) {
        this.docket = docket;
        this.expected = expected;
    }

    setOverall(overall: number) {
        this.overall = overall;
        this.overallPerc = (overall / this.expected) * 100;
    }
    setRecency(recency: number) {
        this.recency = recency;
        this.recencyPerc = (recency / this.expected) * 100;
    }
    setConsistency(consistency: number) {
        this.consistency = consistency;
        this.consistencyPerc = (consistency / this.expected) * 100;
    }
}
