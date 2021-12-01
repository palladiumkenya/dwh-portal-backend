import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByYearQuery } from '../impl/get-median-time-to-art-by-year.query';
import { FactCtTimeToArt } from '../../entities/fact-ct-time-to-art.model';

@QueryHandler(GetMedianTimeToArtByYearQuery)
export class GetMedianTimeToArtByYearHandler implements IQueryHandler<GetMedianTimeToArtByYearQuery> {
    constructor(
        @InjectRepository(FactCtTimeToArt, 'mssql')
        private readonly repository: Repository<FactCtTimeToArt>
    ) {
    }

    async execute(query: GetMedianTimeToArtByYearQuery): Promise<any> {
        let medianTimeToARTSql = this.repository.createQueryBuilder('f')
            .select(['[StartYr], [MedianTimeToARTDiagnosis_year] medianTime'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_yearCounty medianTime'])
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_yearCounty')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.county && query.partner) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_YearCountyPartner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner })
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_YearCountyPartner')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_yearSbCty medianTime'])
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_yearSbCty')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.facility) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_yearFacility medianTime'])
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_yearFacility')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_yearPartner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_yearPartner')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToARTDiagnosis_YearCTAgency medianTime'])
                .andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToARTDiagnosis_YearCTAgency')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.gender) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToART_Gender medianTime'])
                .andWhere('f.Gender IN (:...genders)', { genders: query.gender });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToART_Gender')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.datimAgeGroup) {
            medianTimeToARTSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToART_DATIM_AgeGroup medianTime'])
                .andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });

            return await medianTimeToARTSql
                .groupBy('StartYr, MedianTimeToART_DATIM_AgeGroup')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        return await medianTimeToARTSql
            .groupBy('StartYr, MedianTimeToARTDiagnosis_year')
            .orderBy('f.StartYr')
            .getRawMany();
    }
}
