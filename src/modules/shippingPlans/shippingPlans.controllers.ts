import { Request, Response } from "express";
import {
  createShippingPlanService,
  deleteShippingPlanService,
  getShippingPlanServiceById,
  getShippingPlansService,
  updateShippingPlanService,
} from "./services/shippingPlans.services";
import { createShippingOrderService } from "./services/shippingOrders.services";
import AppError from "../../utils/errors/appError";

export const createShippingOrder = async (req: Request, res: Response) => {
  const { name, orderNumber, createdBy, status } = req.body;
  const role = req.user.role;

  if (role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const shippingOrder = await createShippingOrderService(
    name,
    orderNumber,
    createdBy,
    status
  );

  return res.status(201).json(shippingOrder);
};

export const createShippingPlan = async (req: Request, res: Response) => {
  const {
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
  } = req.body;
  const { orderId } = req.params;
  const shippingPlan = await createShippingPlanService(
    orderId,
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
    status
  );
  return res.status(201).json(shippingPlan);
};

export const getShippingPlans = async (req: Request, res: Response) => {
  const { id } = req.params;
  const shippingPlans = await getShippingPlansService();
  return res.status(200).json(shippingPlans);
};

export const getShippingPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const shippingPlan = await getShippingPlanServiceById(id);
  return res.status(200).json(shippingPlan);
};

export const updateShippingPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    duration,
    weight,
    width,
    height,
    length,
    isActive,
  } = req.body;
  const shippingPlan = await updateShippingPlanService();
  return res.status(200).json(shippingPlan);
};

export const deleteShippingPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteShippingPlanService(id);
  return res.status(204).json();
};
