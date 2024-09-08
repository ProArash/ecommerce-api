import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpLogInterceptor } from './http.log.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new HttpLogInterceptor());
    const port = process.env.PORT || 3000;
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setDescription('Api Docs')
        .setTitle('E-Commerce api')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}
bootstrap();
