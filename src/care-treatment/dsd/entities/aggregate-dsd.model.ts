import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateDSD')
export class AggregateDSD {
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
    StabilityAssessment: number;

    @Column('int')
    patients_TXCurr: number;

    @Column('int')
    patients_onMMD: number;

    @Column('int')
    patients_nonMMD: number;

    @Column('int')
    Stability: number;
}
