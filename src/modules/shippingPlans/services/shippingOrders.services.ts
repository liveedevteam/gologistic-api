import AppError from "../../../utils/errors/appError";
import ShippingOrder from "../models/shippingOrders.model";

export const createShippingOrderService = async (
  name: string,
  orderNumber: string,
  createdBy: string,
  status: string
) => {
  try {
    const newShippingOrder = new ShippingOrder({
      name,
      orderNumber,
      createdBy,
      status,
    });
    return await newShippingOrder.save();
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message, 500);
  }
};

export const getShippingOrdersService = async (page: number, limit: number) => {
  try {
    return await ShippingOrder.find({})
      .skip((page - 1) * limit)
      .limit(limit);
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};
