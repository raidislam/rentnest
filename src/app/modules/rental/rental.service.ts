import { prisma } from "../../lib/prisma";

interface CreateRentalRequestData {
  tenantId: string;
  propertyId: string;
  message?: string;
}

export const createRentalRequest = async (
  data: CreateRentalRequestData,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: data.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (!property.availability) {
    throw new Error("Property is not available");
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      message: data.message,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
  });

  return rentalRequest;
};


export const getMyRentalRequests = async (
  tenantId: string,
) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;
};

export const getRentalRequestById = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You can only view your own rental request",
    );
  }

  return rentalRequest;
};

export const getLandlordRentalRequests = async (
  landlordId: string,
) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;
};


export const updateRentalRequest = async (
  rentalRequestId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error(
      "You can only manage requests for your own properties",
    );
  }

  if (rentalRequest.status !== "PENDING") {
    throw new Error(
      "Only pending rental requests can be updated",
    );
  }

  const updatedRentalRequest =
    await prisma.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },
      data: {
        status,
      },
      include: {
        property: {
          include: {
            category: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  return updatedRentalRequest;
};

export const completeRentalRequest = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You can only complete your own rental request",
    );
  }

  if (rentalRequest.status !== "ACTIVE") {
    throw new Error(
      "Only active rental requests can be completed",
    );
  }

  const completedRental = await prisma.rentalRequest.update({
    where: { id: rentalRequestId },
    data: {
      status: "COMPLETED",
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
  });

  return completedRental;
};