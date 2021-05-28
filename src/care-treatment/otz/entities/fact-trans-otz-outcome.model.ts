import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_OTZOutcome')
export class FactTransOtzOutcome {
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
    OTZStart_Year: number;

    @Column('int')
    OTZStart_Month: number;

    @Column('text')
    Outcome: string;

    @Column('int')
    Total_OutCome: number;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;
}