import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AgeGroupMappingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Perform the age group mapping here
        if (req.query.datimAgeGroup && Array.isArray(req.query.datimAgeGroup)) {
            const mappedAgeGroups = (req.query.datimAgeGroup as string[]).map((ageGroup: string) =>
                this.mapAgeGroup(ageGroup)
            );
            req.query.datimAgeGroup = mappedAgeGroups;
            console.log(mappedAgeGroups);
        }
        next();
    }

    mapAgeGroup(apiAgeGroup: string): string {
        // Perform the mapping from API age group to database age group format
        switch (apiAgeGroup) {
            case '1 to 4':
                return '01 to 04';
            case '5 to 9':
                return '05 to 09';
            case 'Under 1':
                return ' Under 1';
            default:
                return apiAgeGroup; // Return as-is if no mapping is found
        }
    }
}
