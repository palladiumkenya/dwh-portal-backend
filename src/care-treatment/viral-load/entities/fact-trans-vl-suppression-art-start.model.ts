import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_TRANS_VLSuppression_ARTStart')
export class FactTransVlSuppressionArtStart {
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

    @Column('int')
    VLAt6Months: number;

    @Column('int')
    VLAt6Months_Sup: number;

    @Column('int')
    VLAt12Months: number;

    @Column('int')
    VLAt12Months_Sup: number;

    @Column('int')
    VLAt18Months: number;

    @Column('int')
    VLAt18Months_Sup: number;

    @Column('int')
    VLAt24Months: number;

    @Column('int')
    VLAt24Months_Sup: number;
}
