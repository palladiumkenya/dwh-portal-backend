import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Data Request Palantir.dbo.LinelistTicketExport')
export class LinelistTicketExport {
    @PrimaryColumn('text')
    id: string;
}