import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateDSDStable')
export class AggregateDSDStable {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    PartnerName: string;

    @Column('int')
    Stability: number;
}
