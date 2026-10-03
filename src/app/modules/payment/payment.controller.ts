import { Request, Response } from "express";

import {
  createPaymentSchema,
  confirmPaymentSchema,
  paymentCallbackSchema,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};


export const confirmPaymentController = async (
  req: Request,
  res: Response,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const getMyPaymentsController = async (
  req: Request,
  res: Response,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const paymentCallbackController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = paymentCallbackSchema.parse(
      req.body,
    );

    const payment = await handlePaymentCallback(
      validatedData.tran_id,
      validatedData.status,
    );

    res.status(200).json({
      success: true,
      message: "Payment callback processed successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

// SSLCommerz sends the user back here after a successful payment
export const paymentSuccessController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { tran_id, val_id } = req.body;

    const payment = await confirmPayment(tran_id, val_id);

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: payment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentFailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { tran_id } = req.body;

    await handlePaymentCallback(tran_id, "FAILED");

    res.status(400).json({
      success: false,
      message: "Payment failed",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentCancelController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { tran_id } = req.body;

    await handlePaymentCallback(tran_id, "CANCELLED");

    res.status(400).json({
      success: false,
      message: "Payment cancelled",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
