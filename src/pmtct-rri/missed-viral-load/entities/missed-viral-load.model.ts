import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedViralLoad')
export class MissedViralLoad {
    @PrimaryColumn('text')
    id: string;
}
