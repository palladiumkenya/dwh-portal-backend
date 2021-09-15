import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Dim_AgeGroups')
export class DimAgeGroups {
    @PrimaryColumn('text')
    Age: string;

    @Column('text')
    MOH_AgeGroup: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    Dashbard_AgeGroup: string;
}
