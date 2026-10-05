import { NextFunction, Request, Response } from "express";

import {
  createPaymentSchema,
  confirmPaymentSchema,
  paymentCallbackSchema,
  paymentRedirectSchema,
} from "./payment.validation";

import {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  handlePaymentCallback,
} from "./payment.service";

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    const payment = await createPayment(
      validatedData.rentalRequestId,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Payment session created successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};


export const confirmPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = confirmPaymentSchema.parse(req.body);

    const payment = await confirmPayment(
      validatedData.tran_id,
      validatedData.val_id,
    );

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payments = await getMyPayments(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payment = await getPaymentById(
      req.params.id as string,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Payment details retrieved successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = paymentCallbackSchema.parse(
      req.body,
    );

    const payment = await handlePaymentCallback(
      validatedData.tran_id,
      validatedData.status,
      validatedData.val_id,
    );

    res.status(200).json({
      success: true,
      message: "Payment callback processed successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// SSLCommerz sends the user back here after a successful payment.
// We never trust this request alone: confirmPayment checks val_id with SSLCommerz.
export const paymentSuccessController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tran_id, val_id } = confirmPaymentSchema.parse(req.body || {});

    const payment = await confirmPayment(tran_id, val_id);

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentFailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tran_id } = paymentRedirectSchema.parse(req.body || {});

    const payment = await handlePaymentCallback(tran_id, "FAILED");

    res.status(400).json({
      success: false,
      message:
        payment.status === "COMPLETED"
          ? "Payment is already completed"
          : "Payment failed. You can try the payment again.",
      errorDetails: {
        transactionId: payment.transactionId,
        status: payment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const paymentCancelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tran_id } = paymentRedirectSchema.parse(req.body || {});

    const payment = await handlePaymentCallback(tran_id, "CANCELLED");

    res.status(400).json({
      success: false,
      message:
        payment.status === "COMPLETED"
          ? "Payment is already completed"
          : "Payment cancelled. You can try the payment again.",
      errorDetails: {
        transactionId: payment.transactionId,
        status: payment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
