import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class FactManifest {
    @PrimaryColumn({ type: 'uuid' })
    manifestId: string;
    @Column({ type: 'datetime' })
    timeId: Date;
    @Column({ type: 'int' })
    facilityId: number;
    @Column({ type: 'text' })
    emrId: string;
    @Column({ type: 'text' })
    docketId: string;
    @Column({ type: 'int' })
    upload: number;
}
