import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdminValidationSchema = z.object({
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be string"
    }),
    admin: z.object({
        name: z.string({ required_error: "Name is required", invalid_type_error: 'Name must be string' }),
        email: z.string({ required_error: "Email is required", invalid_type_error: 'Email must be string' }),
    })
});

const createDoctorValidationSchema = z.object({
    password: z.string({
        required_error: "Password is required",
    }),
    doctor: z.object({
        name: z.string({ required_error: "Name is required" }),
        email: z.string({ required_error: "Email is required" }),
        contractNumber: z.string({ required_error: "Contract number is required" }),
        address: z.string({ required_error: "Address is required" }).optional(),
        registrationNumber: z.string({ required_error: "Registration Number is required" }),
        experience: z.string({ required_error: "Experience is required" }),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({ required_error: "Appointment is required" }),
        qualification: z.string({ required_error: "Qualification is required" }),
        currentWorkingPlace: z.string({ required_error: "Current working place is required" }),
        designation: z.string({ required_error: "Designation is required" }),
        averageRating: z.number({ required_error: "Average Rating is required" })
    })
});

export const userValidations = {
    createAdminValidationSchema,
    createDoctorValidationSchema
}