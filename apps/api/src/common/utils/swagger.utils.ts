import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

type SwaggerConfig = Partial<{
  title: string;
  description: string;
  version: string;
  tag: string;
}>;

export const makeSwagger = (
  app: INestApplication,
  { title, description, version, tag }: SwaggerConfig = {},
) => {
  const config = new DocumentBuilder()
    .setTitle(title ?? 'Swagger')
    .setDescription(description ?? 'Swagger api description')
    .setVersion(version ?? '1.0')
    .addTag(tag ?? 'swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document));
};
