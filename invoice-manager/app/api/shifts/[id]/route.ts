// app/api/shifts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { addWeeks, endOfMonth, isBefore } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid shift ID" }, { status: 400 });
    }

    const body = await request.json();
    
    // Update the shift
    const updatedShift = await prisma.shift.update({
      where: { id },
      data: { 
        status: body.status,
      }
    });

    return NextResponse.json(updatedShift);
  } catch (error) {
    console.error("Error updating shift:", error);
    return NextResponse.json(
      { error: "Failed to update shift" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; 

    const shiftId = parseInt(params.id);
    if (isNaN(shiftId)) {
      return NextResponse.json({ error: "Invalid shift ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const deleteAll = searchParams.get("deleteAll") === "true";

    // Fetch the shift to get its details and verify ownership
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      select: { recurring: true, date: true, userId: true },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    // Verify the shift belongs to the authenticated user
    if (shift.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: You don’t own this shift" }, { status: 403 });
    }

    if (deleteAll && shift.recurring) {
      // Delete all recurring shifts with the same weekly pattern
      const baseDate = shift.date;
      const lastDayOfMonth = endOfMonth(baseDate);
      let currentDate = baseDate;
      const datesToDelete = [baseDate];

      while (isBefore(addWeeks(currentDate, 1), lastDayOfMonth)) {
        currentDate = addWeeks(currentDate, 1);
        datesToDelete.push(currentDate);
      }

      await prisma.shift.deleteMany({
        where: {
          userId,
          date: {
            in: datesToDelete,
          },
        },
      });

      return NextResponse.json({ message: "Shift and all recurring instances deleted" }, { status: 200 });
    } else {
      // Delete only the single shift
      await prisma.shift.delete({
        where: { id: shiftId },
      });
      return NextResponse.json({ message: "Shift deleted" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting shift:", error);
    return NextResponse.json({ error: "Failed to delete shift" }, { status: 500 });
  }
}