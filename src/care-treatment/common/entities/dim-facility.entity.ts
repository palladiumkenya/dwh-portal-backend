import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class DimFacility {
    @PrimaryColumn({ type: 'int' })
    facilityId: number;
    @Column({ type: 'text' })
    name: string;
    @Column({ type: 'text' })
    county: string;
    @Column({ type: 'text' })
    subCounty: string;
    @Column({ type: 'text' })
    agency: string;
    @Column({ type: 'text' })
    partner: string;
    @Column({ type: 'boolean' })
    isCt: string;
    @Column({ type: 'boolean' })
    isHts: string;
    @Column({ type: 'boolean' })
    isPkv: string;
}
