import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createShiftSchema } from "../../validationSchemas";
import { addWeeks, endOfMonth, isBefore } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // Extract userId from session

    const body = await request.json();

    // Validate request body (userId not included here since it’s from session)
    const validation = createShiftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { class: className, grade, status, date, startTime, endTime, recurring } = body;

    // Parse initial shift date
    let shiftDate = new Date(date);
    const lastDayOfMonth = endOfMonth(shiftDate);

    const shiftsToCreate = [];

    shiftsToCreate.push({
      class: className,
      grade,
      status,
      date: shiftDate,
      startTime,
      endTime,
      recurring,
      userId, // Use session userId
    });

    if (recurring) {
      shiftDate = addWeeks(shiftDate, 1);
      while (isBefore(shiftDate, lastDayOfMonth)) {
        shiftsToCreate.push({
          class: className,
          grade,
          status,
          date: shiftDate,
          startTime,
          endTime,
          recurring,
          userId, // Use session userId
        });

        // Move to the next week
        shiftDate = addWeeks(shiftDate, 1);
      }
    }

    // Bulk insert all shifts
    const newShifts = await prisma.shift.createMany({
      data: shiftsToCreate,
    });

    return NextResponse.json({ message: "Shifts created", shifts: newShifts }, { status: 201 });
  } catch (error) {
    console.error("Error creating shift:", error);
    return NextResponse.json({ error: "Failed to create shift" }, { status: 500 });
  }
}

export async function GET() {
    try {
      // Get the session
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const userId = session.user.id; // Extract userId from session
  
      const shifts = await prisma.shift.findMany({
        where: { userId }, // Filter by session userId
        orderBy: {
          date: "asc",
        },
      });
  
      return NextResponse.json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      return NextResponse.json({ error: "Failed to fetch shifts" }, { status: 500 });
    }
}