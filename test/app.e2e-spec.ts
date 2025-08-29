import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import request from "supertest";
import { Server } from "http";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    http = request(app.getHttpServer() as unknown as Server);
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET)", async () => {
    await http.get("/").expect(200).expect("Hello World!");
  });
});
