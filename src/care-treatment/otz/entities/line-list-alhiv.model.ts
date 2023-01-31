import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LineListALHIV')
export class LineListALHIV {
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

    @Column('text')
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    FirstVL: string;

    @Column('text')
    LastVL: string;

    @Column('int')
    EligibleVL: number;

    @Column('date')
    Last12MonthVLResults: Date;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    Last12MonthVL: number;
}