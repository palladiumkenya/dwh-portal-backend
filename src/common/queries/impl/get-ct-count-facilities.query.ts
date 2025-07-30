export class GetCtCountFacilitiesQuery {
    year?: number;
    month?: number;

    constructor(public docket: string, public period = `${new Date().getFullYear()},${new Date().getMonth()}`) {
    }
}
