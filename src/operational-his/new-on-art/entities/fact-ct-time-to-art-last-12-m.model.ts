import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_CT_TimeToART_Last12M')
export class FactCtTimeToArtLast12M {
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
    MedianTimeToART_Partner: number;

    @Column('float')
    MedianTimeToART_County: number;

    @Column('float')
    MedianTimeToART_SbCty: number;
}
