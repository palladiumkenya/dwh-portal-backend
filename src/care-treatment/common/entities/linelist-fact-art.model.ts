import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Linelist_FACTART')
export class LinelistFACTART {
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
    isPkv: number;

    @Column('int')
    isHts: number;
}
