import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class FacilityManifest {
    @PrimaryColumn({ type: 'uuid' })
    manifestId: number;
    @Column({ type: 'int' })
    timeId: number;
    @Column({ type: 'int' })
    facilityId: number;
    @Column({ type: 'text' })
    emrId: string;
    @Column({ type: 'text' })
    docketId: string;
    @Column({ type: 'int' })
    upload: number;
}
