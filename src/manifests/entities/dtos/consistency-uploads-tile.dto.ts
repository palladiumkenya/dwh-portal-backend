export class ConsistencyUploadsTileDto {
    docket: string;
    consistency: number;

    constructor(docket: string, consistency: number) {
        this.docket = docket;
        this.consistency = consistency;
    }
}
