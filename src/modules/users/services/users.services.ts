import User from "../models/users.model";

export const createUserService = async (data: any) => {
  try {
    const user = new User(data);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};
