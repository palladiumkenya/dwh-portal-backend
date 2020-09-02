import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FactTransHmisStatsTxcurrModel {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    Gender: string;

    @Column('text')
    ageGroup: string;

    @Column('int')
    TXCURR_Total: number;
}
