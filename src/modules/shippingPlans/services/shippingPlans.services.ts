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
  await newShippingPlan.save();
  return {
    message: "createShippingPlanService",
    result: newShippingPlan,
  };
};

export const getShippingPlansService = async () => {
  return { message: "getShippingPlansService" };
};

export const getShippingPlanServiceById = async (id: string) => {
  return { message: "getShippingPlanService" };
};

export const updateShippingPlanService = async () => {
  return { message: "updateShippingPlanService" };
};

export const deleteShippingPlanService = async (id: string) => {
  return { message: "deleteShippingPlanService" };
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
