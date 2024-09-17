import { z, ZodType } from "zod";

export interface UserRegistrationProps {
  type: string;
  fullName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export const UserRegistrationSchema: ZodType<UserRegistrationProps> = z
  .object({
    type: z.string().min(1),
    fullName: z
      .string()
      .min(4, { message: "Your full name must be atleast 4 characters long" }),
    email: z.string().email({ message: "Incorrect email format" }),
    confirmEmail: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Your password must be atleast 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters long",
      })
      .refine(
        (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
        "Password should contain only alphabets and numbers"
      ),
    confirmPassword: z.string(),
    otp: z.string().min(6, { message: "You must enter a 6 digit code" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })
  .refine((schema) => schema.email === schema.confirmEmail, {
    message: "Your emails do not match",
    path: ["confirmEmail"],
  });

export interface UserLoginProps {
  email: string;
  password: string;
}

export const UserLoginSchema: ZodType<UserLoginProps> = z.object({
  email: z.string().email({ message: "You did not enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Your password must be atleast 8 characters long" })
    .max(64, {
      message: "Your password can not be longer than 64 characters long",
    }),
});
