import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createShiftSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate the request body
        const validation = createShiftSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.errors }, 
                { status: 400 }
            );
        }

        // Create new shift with validated data
        const newShift = await prisma.shift.create({
            data: {
                class: body.class,
                grade: body.grade,
                status: body.status,
                date: body.date,
                startTime: body.startTime,
                endTime: body.endTime,
                recurring: body.recurring
            }
        });

        return NextResponse.json(newShift, { status: 201 });
        
    } catch (error) {
        console.error('Error creating shift:', error);
        return NextResponse.json(
            { error: "Failed to create shift" }, 
            { status: 500 }
        );
    }
}