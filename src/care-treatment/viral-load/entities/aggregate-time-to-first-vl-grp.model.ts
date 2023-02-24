import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTimeToFirstVLGrp')
export class AggregateTimeToFirstVLGrp {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('int')
    StartART_Year: number;

    @Column('int')
    StartART_Month: number;

    @Column('text')
    TimeToFirstVLGrp: string;

    @Column('int')
    NumPatients: number;

    @Column('int')
    TotalBySite: number;

    @Column('int')
    proportions: number;
}
