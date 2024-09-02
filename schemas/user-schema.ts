import { z } from "zod";

export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .transform(async (data) => {
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
    });
    return {
      username: data.username,
      hashedPassword,
    };
  });

export type TCreateUserInput = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TLoginUserInput = z.infer<typeof loginUserSchema>;
