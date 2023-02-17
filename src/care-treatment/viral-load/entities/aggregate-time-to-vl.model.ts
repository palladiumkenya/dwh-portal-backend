import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTimeToVL')
export class AggregateTimeToVL {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    Gender: string;

    @Column('int')
    StartYr: number;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    MedianTimeToFirstVL_year: number;

    @Column('int')
    MedianTimeToFirstVL_yearPartner: number;

    @Column('int')
    MedianTimeToFirstVL_yearCounty: number;

    @Column('int')
    MedianTimeToFirstVL_yearSbCty: number;

    @Column('int')
    MedianTimeToFirstVL_yearFacility: number;

    @Column('int')
    MedianTimeToFirstVL_yearCountyPartner: number;

    @Column('int')
    MedianTimeToFirstVL_yearCTAgency: number;

    @Column('int')
    MedianTimeToFirstVL_Gender: number;

    @Column('int')
    MedianTimeToFirstVL_DATIM_AgeGroup: number;
}
