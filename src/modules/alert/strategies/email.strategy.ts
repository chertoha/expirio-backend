import { Injectable, Logger } from "@nestjs/common";
import { Alert, Batch, Product, StorageBatch } from "@prisma/client";
import { NotificationStrategy } from "src/helpers/interfaces";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { format } from "date-fns";

@Injectable()
export class NodemailerEmailStrategy implements NotificationStrategy {
  private readonly logger = new Logger(NodemailerEmailStrategy.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: Number(process.env.MAIL_PORT) || 465,
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.resolve("./src/mail/templates"),
          layoutsDir: path.resolve("./src/mail/templates"),
          defaultLayout: undefined,
        },
        viewPath: path.resolve("./src/mail/templates"),
        extName: ".hbs",
      }),
    );

    this.transporter.verify((error, _success) => {
      if (error) {
        this.logger.error(
          "❌ Mail transporter connection failed:",
          error.message,
        );
      } else {
        this.logger.log("✅ Mail transporter connected successfully");
      }
    });
  }

  async sendAlert(
    alert: Alert,
    batches: (Batch & { product: Product; storages: StorageBatch[] })[],
  ) {
    const batchData = batches.map(b => {
      const totalQty = b.storages.reduce((sum, s) => sum + s.qty, 0);
      return {
        productName: b.product.name,
        batchNumber: b.batchNumber,
        expirationDate: format(new Date(b.expirationDate), "dd.MM.yyyy"),
        totalQty,
      };
    });

    console.log(batchData);

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USERNAME,
        to: process.env.ALERT_EMAIL_TO,
        subject: `⚠️ Expiration Alert: ${alert.name}`,
        template: "alert-email",
        context: {
          alertName: alert.name,
          daysBefore: alert.daysBefore,
          batches: batchData,
          year: new Date().getFullYear(),
        },
        attachments: [
          {
            filename: "xpirio-logo.jpg",
            path: path.resolve("./src/public/xpirio-logo.jpg"),
            cid: "logo",
          },
        ],
      } as any);

      this.logger.log(`✅ Email alert "${alert.name}" sent successfully`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send email for alert "${alert.name}": ${error.message}`,
        error,
      );
    }
  }
}
