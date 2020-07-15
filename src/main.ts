import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
    const keyFile = fs.readFileSync('./secrets/kenyahmis.org.key');
    const certFile = fs.readFileSync('./secrets/kenyahmis.org.crt');
    const options = process.env.NODE_ENV.trim() === 'production' ? {
        key: keyFile,
        cert: certFile,
    } : null;

    const app = await NestFactory.create(AppModule, {
        httpsOptions: options
    });

    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(helmet());
    app.use(cookieParser());
    app.use(csurf({ cookie: true }));
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
        }),
    );
    await app.listen(process.env.APP_PORT || 4000);
}
bootstrap();
