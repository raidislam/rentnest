import { prisma } from "../../lib/prisma";
import axios from "axios";
import { sslcommerzConfig } from "../../../config/sslcommerz";

export const createPayment = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      tenant: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You can only make payment for your own rental request",
    );
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new Error(
      "Payment can only be made for an approved rental request",
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      rentalRequestId,
    },
  });

  if (existingPayment) {
    throw new Error(
      "Payment already exists for this rental request",
    );
  }

  const transactionId = `RENT-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      transactionId,
      rentalRequestId,
      amount: rentalRequest.property.price,
      method: "ONLINE",
      provider: "SSLCOMMERZ",
      status: "PENDING",
    },
  });

  const paymentData = {
    store_id: sslcommerzConfig.storeId,
    store_passwd: sslcommerzConfig.storePassword,
    total_amount: Number(payment.amount),
    currency: "BDT",
    tran_id: payment.transactionId,

    success_url: sslcommerzConfig.successUrl,
    fail_url: sslcommerzConfig.failUrl,
    cancel_url: sslcommerzConfig.cancelUrl,
    ipn_url: sslcommerzConfig.ipnUrl,

    product_name: rentalRequest.property.title,
    product_category: "Rental Property",
    product_profile: "general",

    cus_name: rentalRequest.tenant.name,
    cus_email: rentalRequest.tenant.email,

    shipping_method: "NO",
  };

  const apiUrl = sslcommerzConfig.isLive
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  const response = await axios.post(
    apiUrl,
    new URLSearchParams(paymentData).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (!response.data?.GatewayPageURL) {
    await prisma.payment.delete({
      where: {
        id: payment.id,
      },
    });

    throw new Error("Failed to create SSLCommerz payment session");
  }

  return {
    paymentId: payment.id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    paymentUrl: response.data.GatewayPageURL,
  };
};


export const confirmPayment = async (transactionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "COMPLETED") {
    return payment;
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: "COMPLETED",
      paidAt: new Date(),
    },
  });

  await prisma.rentalRequest.update({
    where: {
      id: payment.rentalRequestId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return updatedPayment;
};


export const getMyPayments = async (tenantId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

export const getPaymentById = async (
  paymentId: string,
  tenantId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You can only view your own payment",
    );
  }

  return payment;
};

export const handlePaymentCallback = async (
  transactionId: string,
  status: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (status === "VALID" || status === "VALIDATED") {
    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    await prisma.rentalRequest.update({
      where: {
        id: payment.rentalRequestId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    return updatedPayment;
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: "FAILED",
    },
  });

  return updatedPayment;
};