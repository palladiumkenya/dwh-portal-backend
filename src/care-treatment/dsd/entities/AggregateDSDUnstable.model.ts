import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateDSDUnstable')
export class AggregateDSDUnstable {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    Gender: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    TxCurr: number;

    @Column('int')
    MMD: number;

    @Column('int')
    NonMMD: number;
}
