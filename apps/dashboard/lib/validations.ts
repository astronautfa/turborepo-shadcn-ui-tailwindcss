import * as z from "zod";

export const usernameSchema = z
  .string()
  .min(1, "Username is Required")
  .regex(/^(?=.{8,15}$)/, "Username must be 8-15 characters long.")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Username must be alphanumeric and can contain [_ . -]"
  );

export const emailSchema = z
  .string()
  .min(1, "Email is Required")
  .email("Please enter a valid email");

export const passwordSchema = z
  .string()
  .min(1, "Password is Required")
  .regex(/^(?!\s*$).+/, "Password must not contain Whitespaces.")
  .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter.")
  .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter.")
  .regex(/^(?=.*\d)/, "Password must contain at least one number.")
  .regex(
    /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹])/,
    "Password must contain at least one special character."
  )
  .min(8, "Password must be at least 8 characters long.");

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(6, { message: "Password is too short" }),
    "confirm-pass": z.string().min(6, { message: "Password is too short" }),
  })
  .refine(
    (data) => {
      if (data["confirm-pass"] !== data.password) {
        console.log("running");
        return false;
      } else {
        return true;
      }
    },
    { message: "Password does't match", path: ["confirm-pass"] }
  );

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  newPassword: passwordSchema,
});

export const newPlaylistSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  description: z
    .string()
    .max(255, { message: "Description must be at most 255 characters long" })
    .optional(),
});