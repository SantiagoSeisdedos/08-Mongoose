import { errorStatusMap } from "../utils/errorCodes.js";

export function isAuthorized(roles) {
  return async function (req, res, next) {
    const { rol } = req.user;
    if (roles.includes(rol) || (rol === "premium" && req.params.id && req.params.id === req.user._id)) {
      return next();
    }
    const typedError = new Error("You are not authorized");
    typedError.code = errorStatusMap.FORBIDDEN;
    next(typedError);
  };
}
