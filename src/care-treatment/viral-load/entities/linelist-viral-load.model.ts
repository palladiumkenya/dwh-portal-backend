import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LineListViralLoad')
export class LineListViralLoad {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    PatientPK: string;

    @Column('text')
    PatientID: string;

    @Column('text')
    LatestVL1: string;

    @Column('text')
    LatestVLDate1Key: string;

    @Column('text')
    LatestVL2: string;

    @Column('text')
    LatestVLDate2Key: string;

    @Column('text')
    LatestVL3: string;

    @Column('text')
    LatestVLDate3Key: string;

}
