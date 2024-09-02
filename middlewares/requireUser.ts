import { sendError } from "../lib/response-helper";
import catchAsync from "../lib/catch-async";

export const requireUser = catchAsync(async (req, res, next) => {
  if (!res.locals.user) {
    return sendError(401, "Unauthorized");
  }

  return next();
});
