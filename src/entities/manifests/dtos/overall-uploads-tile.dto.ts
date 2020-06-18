export class OverallUploadsTileDto {
    docket: string;
    overall: number;

    constructor(docket: string, overall: number) {
        this.docket = docket;
        this.overall = overall;
    }
}
