import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });
  app.setGlobalPrefix("api");

  const PORT = process.env.PORT ?? 9000;

  await app.listen(PORT, () =>
    console.log(`\x1b[34mServer started on port = ${PORT}\x1b[0m`),
  );
}
bootstrap();
