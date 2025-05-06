import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    idNumber: z.string().min(5, "ID number must be at least 5 characters"),
    city: z.string().optional(),
    woreda: z.string().optional(),
    houseNumber: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(1, "Password is required"),
});

export const complaintSchema = z.object({
  vehiclePlateNumber: z.string().optional(),
  category: z.enum([
    "Driver Behavior",
    "Vehicle Condition",
    "Payment Issue",
    "Traffic Officer Misconduct",
    "Other",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  evidence: z.any().optional(),
});

export const accidentReportSchema = z.object({
  location: z.string().min(1, "Location is required"),
  timeOfAccident: z.string().min(1, "Time of accident is required"),
  vehiclePlateNumber: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
});
