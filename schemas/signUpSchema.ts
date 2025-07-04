import * as z from "zod";


export const signUpSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter valid email" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password shoud contain min 8 charachters" }),
    passwordConformation: z
        .string()
        .min(1, { message: "Pleas confirm your passport" })
})
    .refine((data) => data.password === data.passwordConformation, {
        message: "Password do not match",
        path: ["passwordConformation"],
    })