/**
 * POST /api/admin/workshops/[workshopId]/attendance
 * Record attendance for a participant
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";

export async function POST(
  request: NextRequest,
  { params }: { params: { workshopId: string } }
) {
  try {
    const { workshopId } = params;

    if (!workshopId) {
      return NextResponse.json(
        { status: "error", message: "Missing workshopId parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { enrollmentId, sessionId, day, present, arrivedOnTime, materialsReceived } = body;

    // Validate required fields
    if (!enrollmentId) {
      return NextResponse.json(
        { status: "error", message: "enrollmentId is required" },
        { status: 400 }
      );
    }

    if (!sessionId && sessionId !== 0) {
      return NextResponse.json(
        { status: "error", message: "sessionId is required" },
        { status: 400 }
      );
    }

    if (typeof present !== "boolean") {
      return NextResponse.json(
        { status: "error", message: "present must be a boolean" },
        { status: 400 }
      );
    }

    // Verify workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { id: true, scheduledStartDate: true },
    });

    if (!workshop) {
      return NextResponse.json(
        { status: "error", message: "Workshop not found" },
        { status: 404 }
      );
    }

    // Verify enrollment exists and belongs to this workshop
    const enrollment = await prisma.workshopEnrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        id: true,
        cohort: {
          select: {
            workshopId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { status: "error", message: "Enrollment not found" },
        { status: 404 }
      );
    }

    if (enrollment.cohort.workshopId !== workshopId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Enrollment does not belong to this workshop",
        },
        { status: 400 }
      );
    }

    // Calculate session date from day offset
    const sessionDate = new Date(workshop.scheduledStartDate);
    if (day) {
      sessionDate.setDate(sessionDate.getDate() + day);
    }

    // Upsert attendance record
    const attendance = await prisma.workshopAttendance.upsert({
      where: {
        enrollmentId_sessionNumber: {
          enrollmentId,
          sessionNumber: sessionId,
        },
      },
      create: {
        enrollmentId,
        sessionNumber: sessionId,
        sessionDate,
        attended: present,
        arrivedAt: arrivedOnTime && present ? new Date() : null,
        materialsReceived: materialsReceived || false,
      },
      update: {
        attended: present,
        arrivedAt: arrivedOnTime && present ? new Date() : null,
        materialsReceived: materialsReceived || false,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        sessionNumber: true,
        sessionDate: true,
        attended: true,
        arrivedAt: true,
        materialsReceived: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/workshops/[workshopId]/attendance]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to record attendance",
      },
      { status: 500 }
    );
  }
}
