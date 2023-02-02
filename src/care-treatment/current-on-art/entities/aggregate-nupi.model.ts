import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateNupi')
export class AggregateNupi {
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
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    number_children: number;

    @Column('int')
    number_adults: number;

    @Column('int')
    number_nupi: number;
}
