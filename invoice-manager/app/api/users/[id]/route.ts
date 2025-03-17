import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PATCH(request: Request, { params } : { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, wagePerHour, contactNumber, managerName, bsb, accountNumber } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        wagePerHour,
        contactNumber,
        managerName,
        bsb, 
        accountNumber, 
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}