import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
  const port = process.env.SERVER_PORT || process.env.PORT || 4000

  app.use(helmet())

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Zawer API')
    .setDescription('Zawer 后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(port)

  console.log(`Server is running on: http://localhost:${port}`)
  console.log(`Swagger documentation: http://localhost:${port}/api-docs`)
  console.log(`Frontend origin: ${frontendOrigin}`)
}

bootstrap()
