import User from "../models/users.model";

export const createUserService = async (
  name: string,
  department: string,
  authId: string
) => {
  try {
    const user = new User({
      name,
      department,
      auth: authId,
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};
