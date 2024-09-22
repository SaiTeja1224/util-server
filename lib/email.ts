import { Resend } from "resend";
import type { sendEmailInput } from "../schemas/email-schema";

const resendClient = new Resend(Bun.env.RESEND_API_KEY as string);

export const sendEmail = async ({
  from,
  email,
  subject,
  text,
  type,
}: sendEmailInput) => {
  try {
    const response = await resendClient.emails.send({
      from: `${type} <onboarding@resend.dev>`,
      to: email,
      subject: subject,
      replyTo: from,
      text: text,
    });

    return { success: true, response };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "Something went wrong" };
    }
  }
};

export const getEmail = async (id: string) => {
  try {
    const response = await resendClient.emails.get(id);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
