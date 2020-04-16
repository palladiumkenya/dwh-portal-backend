import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { pick } from 'lodash';

export interface EnvConfig {
    [key: string]: string;
}

export class DatabaseConnectionService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath.trim()));
        const inputTobeValidated = pick(config, ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_DB']);
        this.envConfig = this.validateInput(inputTobeValidated);
        console.log(process.env.DATABASE_DB);
    }

    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'production', 'test', 'provision')
                .default('development'),
            DATABASE_PORT: Joi.number().default(3000),
            DATABASE_HOST: Joi.string(),
            DATABASE_USER: Joi.string(),
            DATABASE_PASSWORD: Joi.string(),
            DATABASE_DB: Joi.string(),
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }

    get port(): string {
        return String(this.envConfig.DATABASE_PORT);
    }

    get host(): string {
        return String(this.envConfig.DATABASE_HOST);
    }

    get username(): string {
        return String(this.envConfig.DATABASE_USER);
    }

    get password(): string {
        return String(this.envConfig.DATABASE_PASSWORD);
    }

    get database(): string {
        return String(this.envConfig.DATABASE_DB);
    }
}
