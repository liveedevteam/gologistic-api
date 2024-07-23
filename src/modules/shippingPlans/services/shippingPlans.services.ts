import AppError from "../../../utils/errors/appError";
import ShippingOrder from "../models/shippingOrders.model";
import ShippingPlan from "../models/shippingPlans.model";

export const createShippingPlanService = async (
  orderId: string,
  routeStart: string,
  routeEnd: string,
  fuelCost: number,
  vehicleType: string,
  vehicleCount: number,
  packageCode: string,
  packageCount: number,
  distributionPlan: string,
  purchaseBudget: number,
  commission: number,
  packageReceivedDate: string,
  planningNumber: string,
  status: string
) => {
  const shippingOrderDoc = await getShippingOrderServiceById(orderId);
  const shippingOrder = shippingOrderDoc._id;
  const newShippingPlan = new ShippingPlan({
    shippingOrder,
    routeStart,
    routeEnd,
    fuelCost,
    vehicleType,
    vehicleCount,
    packageCode,
    packageCount,
    distributionPlan,
    purchaseBudget,
    commission,
    packageReceivedDate,
    planningNumber,
    status,
  });
  try {
    await newShippingPlan.save();
    return {
      message: "createShippingPlanService",
      result: newShippingPlan,
    };
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const getShippingPlansService = async (page: number, limit: number) => {
  try {
    return {
      message: "getShippingPlansService",
      result: await ShippingPlan.find({}).skip((page - 1) * limit),
    };
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const getShippingPlanServiceById = async (id: string) => {
  try {
    return {
      message: "getShippingPlan by ID Service",
      result: await ShippingPlan.findById(id),
    };
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const updateShippingPlanService = async (data: any) => {
  const { id, ...updateData } = data;
  try {
    const shippingPlan = await ShippingPlan.findOneAndUpdate(
      {
        _id: id,
      },
      updateData,
      { new: true }
    );
    return {
      message: "updateShippingPlanService",
      result: shippingPlan,
    };
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const deleteShippingPlanService = async (id: string) => {
  try {
    await ShippingPlan.findByIdAndDelete(id);
    return { message: "deleteShippingPlanService" };
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const getShippingOrderServiceById = async (id: string) => {
  try {
    const shippingOrder = await ShippingOrder.findById(id);
    if (!shippingOrder) {
      throw new AppError("Shipping order not found", 404);
    }
    return shippingOrder;
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};
