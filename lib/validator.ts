import type { z } from "zod";

const validate = async <T extends z.ZodTypeAny, O, I>(
  validator: z.ZodEffects<T, O, I> | z.ZodType<O, z.ZodTypeDef, I>,
  data: unknown,
  { async } = { async: false }
) => {
  let result;
  if (async) {
    result = await validator.safeParseAsync(data);
  } else {
    result = validator.safeParse(data);
  }
  if (!result.success) {
    // Handle validation errors
    console.error("Validation failed:", result.error.message);
    return {
      success: false as const,
      message: `Validation failed`,
      errors: result.error.flatten().fieldErrors,
    };
  }
  return {
    success: true as const,
    data: result.data,
  };
};

export default validate;
