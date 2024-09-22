import { z } from "zod";

export const sendEmailSchema = z.object({
  from: z.string().email("Invalid email address"),
  email: z.string().email("Invalid email address"),
  subject: z.string(),
  type: z.string(),
  text: z.string(),
});

export type sendEmailInput = z.infer<typeof sendEmailSchema>;
