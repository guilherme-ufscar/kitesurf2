import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.enableCors({
    origin: process.env.APP_URL ?? 'http://localhost:3000',
    credentials: true,
  })

  // Serve local uploads
  app.useStaticAssets(process.env.UPLOAD_DIR ?? '/app/uploads', { prefix: '/uploads' })

  // Swagger
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('KITE360º API')
      .setDescription('Marketplace de Esportes Aquáticos')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config))
  }

  const port = process.env.API_PORT ?? 8000
  await app.listen(port)
  console.log(`KITE360º API running on :${port}`)
}

bootstrap()
