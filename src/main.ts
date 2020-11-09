import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
    const options = process.env.NODE_ENV.trim() === 'production' ? {
        key: fs.readFileSync('./secrets/kenyahmis.org.key'),
        cert: fs.readFileSync('./secrets/kenyahmis.org.crt'),
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
            windowMs: 2 * 60 * 1000, // 2 minutes
            max: 10000, // limit each IP to 10000 requests per windowMs
        }),
    );
    await app.listen(process.env.APP_PORT || 4000);
}
bootstrap();
