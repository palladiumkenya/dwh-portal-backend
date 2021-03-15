import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_CT_TimeToFirstVL')
export class FactCtTimeToFirstVl {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    StartYr: number;

    @Column('float')
    MedianTimeToFirstVL_year: number;

    @Column('float')
    MedianTimeToFirstVL_yearPartner: number;

    @Column('float')
    MedianTimeToFirstVL_yearCounty: number;

    @Column('float')
    MedianTimeToFirstVL_yearSbCty: number;

    @Column('float')
    MedianTimeToFirstVL_yearFacility: number;
}
