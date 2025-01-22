import * as z from "zod";

export const UserRole = {
  User: "User",
  SystemAdministrator: "SystemAdministrator",
  SecurityAdministrator: "SecurityAdministrator",
  PermitAdministrator: "PermitAdministrator",
  PermitHolder: "PermitHolder",
  RightsHolder: "RightsHolder",
  Skipper: "Skipper",
  Inspector: "Inspector",
  Monitor: "Monitor",
  Driver: "Driver",
  FactoryStockController: "FactoryStockController",
  LocalOutletController: "LocalOutletController",
  ExportController: "ExportController",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const userRoles = Object.values(UserRole);

export const UserRoleEnum = z.enum([
  "User",
  "SystemAdministrator",
  "SecurityAdministrator",
  "PermitAdministrator",
  "PermitHolder",
  "RightsHolder",
  "Skipper",
  "Inspector",
  "Monitor",
  "Driver",
  "FactoryStockController",
  "LocalOutletController",
  "ExportController",
] as const);

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email cannot exceed 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password cannot exceed 255 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name cannot exceed 100 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name cannot exceed 100 characters"),
    rsa_id: z.string().max(13, "RSA ID cannot exceed 13 characters").optional(),
    cell_number: z
      .string()
      .max(20, "Cell number cannot exceed 20 characters")
      .optional(),
    physical_address: z.string().optional(),
    roleapplication: z
      .string()
      .default("User")
      .refine((val) => Object.values(UserRole).includes(val as UserRoleType), {
        message: "Invalid role application type",
      }),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
