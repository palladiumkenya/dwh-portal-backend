import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedDTGOptimization')
export class MissedDTGOptimization {
    @PrimaryColumn('text')
    id: string;
}
