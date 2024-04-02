import { daoUsers } from "../dao/daoInstance.js";
import { deleteTokenFromCookie } from "../middlewares/tokens.js";
import { errorStatusMap } from "../utils/errorCodes.js";

export async function authenticateUser(credentials) {
  try {
    const user = await daoUsers.authentication(credentials);
    if (!user) {
      const error = new Error("User not found");
      error.code = errorStatusMap.NOT_FOUND;
      throw error;
    }
    return user;
  } catch (error) {
    const typedError = new Error("Failed to authenticate user");
    typedError.code = errorStatusMap.UNAUTHORIZED;
    throw typedError;
  }
}

export async function deleteAuthToken(req, res, next) {
  await daoUsers.updateUser(req.user.email, {
    last_connection: new Date(),
  });
  return deleteTokenFromCookie(req, res, next).status(200).json({
    status: "success",
    message: "Token deleted successfully!",
  });
}
