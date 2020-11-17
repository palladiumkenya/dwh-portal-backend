export class RecencyUploadsTileDto {
    docket: string;
    recency: number;

    constructor(docket: string, recency: number) {
        this.docket = docket;
        this.recency = recency;
    }
}
