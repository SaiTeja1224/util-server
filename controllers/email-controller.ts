import catchAsync from "../lib/catch-async";
import { sendEmail } from "../lib/email";
import { sendError, sendSuccess } from "../lib/response-helper";
import validate from "../lib/validator";
import { sendEmailSchema } from "../schemas/email-schema";

export const sendEmailHandler = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await validate(sendEmailSchema, body);

  if (!result.success) {
    return sendError(400, result.message, result.errors);
  }

  const emailResult = await sendEmail(result.data);
  if (emailResult.success) {
    return sendSuccess(res, 200, "Failed to send email", {
      response: emailResult.response?.data,
    });
  } else {
    return sendError(400, "Failed to send email", emailResult.error);
  }
});
