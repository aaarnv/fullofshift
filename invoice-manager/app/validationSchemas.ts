import { date, z } from "zod";

export const createShiftSchema = z.object({
    class: z.string().min(1).max(255),
    grade: z.string().min(1).max(255),
    status: z.enum(["UPCOMING", "PENDING", "LOGGED", "REQUESTED", "PAID"]),
    date: z.coerce.date(),
    startTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 
            "Start time must be in HH:MM format"),
    endTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 
            "End time must be in HH:MM format"),
    recurring: z.boolean().default(false)
});