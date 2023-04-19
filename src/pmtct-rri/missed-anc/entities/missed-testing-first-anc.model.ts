import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedTestingFirstANC')
export class MissedTestingFirstANC {
    @PrimaryColumn('text')
    id: string;
}
