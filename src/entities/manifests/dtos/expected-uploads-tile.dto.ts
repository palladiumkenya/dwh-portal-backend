export class ExpectedUploadsTileDto {
    docket: string;
    expected: number;

    constructor(docket: string, expected: number) {
        this.docket = docket;
        this.expected = expected;
    }
}
