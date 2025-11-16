import { Alert, Batch } from "@prisma/client";

export interface NotificationStrategy {
  sendAlert(alert: Alert, products: Batch[]): Promise<void>;
}
