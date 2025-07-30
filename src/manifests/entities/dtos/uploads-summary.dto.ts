export class UploadsSummaryDto {
    constructor(
        public docket: string,
        public totalFacilities: number,
        public totalPartners: number,
        public totalCounties: number
    ) {
    }
}
