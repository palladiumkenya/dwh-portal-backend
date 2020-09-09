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
        const inputTobeValidated = pick(config, [
            'DATABASE_HOST',
            'DATABASE_PORT',
            'DATABASE_USER',
            'DATABASE_PASSWORD',
            'DATABASE_DB',
            'DATABASE_HOST_MSSQL',
            'DATABASE_PORT_MSSQL',
            'DATABASE_USER_MSSQL',
            'DATABASE_PASSWORD_MSSQL',
            'DATABASE_DB_MSSQL'
        ]);
        this.envConfig = this.validateInput(inputTobeValidated);
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
            DATABASE_HOST_MSSQL: Joi.string(),
            DATABASE_PORT_MSSQL: Joi.number(),
            DATABASE_USER_MSSQL: Joi.string(),
            DATABASE_PASSWORD_MSSQL: Joi.string(),
            DATABASE_DB_MSSQL: Joi.string()
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }

    get port(): number {
        return Number(this.envConfig.DATABASE_PORT);
    }

    get portMssql(): number {
        console.log("PORT SQL SERVER", Number(this.envConfig.DATABASE_PORT_MSSQL));
        return Number(this.envConfig.DATABASE_PORT_MSSQL);
    }

    get host(): string {
        return String(this.envConfig.DATABASE_HOST);
    }

    get hostMssql(): string {
        return String(this.envConfig.DATABASE_HOST_MSSQL);
    }

    get username(): string {
        return String(this.envConfig.DATABASE_USER);
    }

    get usernameMssql(): string {
        return String(this.envConfig.DATABASE_USER_MSSQL);
    }

    get password(): string {
        return String(this.envConfig.DATABASE_PASSWORD);
    }

    get passwordMssql(): string {
        return String(this.envConfig.DATABASE_PASSWORD_MSSQL);
    }

    get database(): string {
        return String(this.envConfig.DATABASE_DB);
    }

    get databaseMssql(): string {
        return String(this.envConfig.DATABASE_DB_MSSQL);
    }
}
