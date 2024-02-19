import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('all_EMRSites')
export class AllEmrSites {
    @PrimaryColumn('text')
    facilityId: string;

    @Column('text')
    name: string;

    @Column('text')
    county: string;

    @Column('text')
    subCounty: string;

    @Column('text')
    agency: string;

    @Column('text')
    partner: string;

    @Column('text')
    owner: string;

    @Column('text')
    latitude: string;

    @Column('text')
    longitude: string;

    @Column('text')
    EMR: string;

    @Column('int')
    isCT: number;

    @Column('int')
    isHts: number;
}
