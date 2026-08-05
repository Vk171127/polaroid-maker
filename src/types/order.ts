import type { Layout } from "@/types/layouts";
import type { PrintData } from "@/types/printData";

export interface Order {
  orderId: string;
  name: string;
  phoneNumber: string;
  layout: Layout;
  printData: PrintData;
}
