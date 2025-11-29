import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { RolesGuard } from "./modules/auth/guards/roles.guard";
import { PrismaExceptionFilter } from "./filters/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });
  app.setGlobalPrefix("api");

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const PORT = process.env.PORT ?? 9000;

  await app.listen(PORT, "0.0.0.0", () =>
    console.log(`\x1b[34mServer started on port = ${PORT}\x1b[0m`),
  );
}
bootstrap();
