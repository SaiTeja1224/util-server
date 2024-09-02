import { Resend } from "resend";

const resendClient = new Resend(Bun.env.RESEND_API_KEY as string);

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    const response = await resendClient.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: subject,
      text: text,
    });

    return response;
  } catch (error) {
    console.error(error);
    return error;
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
