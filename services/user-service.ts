import { sendError } from "../lib/response-helper";
import UserModel from "../models/user-modal";
import { type TCreateUserInput } from "../schemas/user-schema";

export const createUser = async (data: TCreateUserInput) => {
  try {
    const user = new UserModel(data);
    const queryResult = await user.save();

    const responseData = {
      username: queryResult.username,
      _id: queryResult._id,
    };
    return responseData;
  } catch (error: any) {
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateKey];

      sendError(
        409,
        `The ${duplicateKey} '${duplicateValue}' is already taken.`
      );
    }

    console.error(error);
    sendError(500, "An error occurred while creating the user.");
  }
};

export const findByUsername = async (username: string) => {
  const queryResult = await UserModel.findOne(
    { username },
    { username: 1, hashedPassword: 1 }
  ).lean();
  return queryResult;
};
