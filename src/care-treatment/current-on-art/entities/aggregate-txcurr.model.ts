import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTXCurr')
export class AggregateTXCurr {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    ParnterName: string;

    @Column('text')
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('int')
    CountClientsTXCur: number;
}
