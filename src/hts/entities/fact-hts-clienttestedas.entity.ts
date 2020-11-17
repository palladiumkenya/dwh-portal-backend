import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FactHtsClientTestedAs {
    @PrimaryColumn('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    ClientTestedAs: string;

    @Column('int')
    year: number;

    @Column('int')
    month: number;

    @Column('text')
    MonthName: string;

    @Column('int')
    Tested: number;

    @Column('int')
    positive: number;

    @Column('int')
    linked: number;
}
