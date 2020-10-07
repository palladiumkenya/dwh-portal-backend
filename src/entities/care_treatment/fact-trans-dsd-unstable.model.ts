import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_DSD_Unstable')
export class FactTransDsdUnstable {
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
    onARTlessthan12mnths: number;

    @Column('int')
    Agelessthan20Yrs: number;

    @Column('int')
    Adherence: number;

    @Column('int')
    HighVL: number;

    @Column('int')
    BMI: number;
}
