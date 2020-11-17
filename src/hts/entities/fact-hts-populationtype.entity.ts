import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FactHtsPopulationType {
    @PrimaryColumn('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    PopulationType: string;

    @Column('text')
    Gender: string;

    @Column('int')
    Year: number;

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
