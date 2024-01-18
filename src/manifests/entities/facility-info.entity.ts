import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('mfl_interface_db.facilities_facility_info')
export class FacilityInfo {
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
