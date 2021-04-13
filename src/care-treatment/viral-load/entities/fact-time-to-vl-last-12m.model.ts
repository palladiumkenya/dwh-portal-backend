import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_TimeToVL_Last12M')
export class FactTimeToVlLast12M {
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

    @Column('float')
    MedianTimeToFirstVL_Partner: number;

    @Column('float')
    MedianTimeToFirstVL_County: number;

    @Column('float')
    MedianTimeToFirstVL_SbCty: number;
}
