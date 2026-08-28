import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid("Invalid rental request ID"),
});

export const confirmPaymentSchema = z.object({
  tran_id: z.string().min(1, "Transaction ID is required"),
});

export const paymentCallbackSchema = z.object({
  tran_id: z.string().min(1),
  status: z.string().min(1),
});