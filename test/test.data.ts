import * as uuid from 'uuid';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DimFacility } from '../src/entities/common/dim-facility.entity';

const pattern = '**/*.seed.test.json';

const getFiles = async () => {
    let files: string[] = [];
    files = await fg([pattern], { dot: true });
    return files;
};

export const getTestDimFacilities = async () => {
    const seedFiles = await getFiles();
    const fileToParse = seedFiles.find(f => f.includes('dim_facility'.toLowerCase()));
    if (fileToParse) {
        Logger.log(`reading seed [${fileToParse}]`);
        const contents = fs.readFileSync(fileToParse).toString();
        const data: DimFacility[] = JSON.parse(contents);
        return plainToClass(DimFacility, data);
    }
    return [];
};
