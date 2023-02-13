import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTimeToVL12M')
export class AggregateTimeToVL12M {
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

    @Column('float')
    MedianTimeToFirstVL_Partner: number;

    @Column('float')
    MedianTimeToFirstVL_County: number;

    @Column('float')
    MedianTimeToFirstVL_SbCty: number;

    @Column('float')
    MedianTimeToFirstVL_CTAgency: number;
}
