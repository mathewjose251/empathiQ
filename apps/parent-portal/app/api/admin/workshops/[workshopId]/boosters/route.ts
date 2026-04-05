/**
 * GET /api/admin/workshops/[workshopId]/boosters
 * List all booster checkpoints for a workshop's enrollments
 *
 * POST /api/admin/workshops/[workshopId]/boosters
 * Update a booster checkpoint status
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const { workshopId } = await params;

    if (!workshopId) {
      return NextResponse.json(
        { status: "error", message: "Missing workshopId parameter" },
        { status: 400 }
      );
    }

    // Verify workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { id: true },
    });

    if (!workshop) {
      return NextResponse.json(
        { status: "error", message: "Workshop not found" },
        { status: 404 }
      );
    }

    const boosters = await prisma.workshopBooster.findMany({
      where: {
        enrollment: {
          cohort: {
            workshopId,
          },
        },
      },
      select: {
        id: true,
        enrollmentId: true,
        boosterDay: true,
        boosterDate: true,
        status: true,
        sentAt: true,
        completedAt: true,
        completionNotes: true,
        requiresEscalation: true,
        escalationReason: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { boosterDate: "asc" },
    });

    return NextResponse.json({
      status: "success",
      data: boosters,
      count: boosters.length,
    });
  } catch (error) {
    console.error("[GET /api/admin/workshops/[workshopId]/boosters]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch booster checkpoints",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const { workshopId } = await params;

    if (!workshopId) {
      return NextResponse.json(
        { status: "error", message: "Missing workshopId parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { enrollmentId, day, status, parentResponse, mentorEscalation } = body;

    // Validate required fields
    if (!enrollmentId) {
      return NextResponse.json(
        { status: "error", message: "enrollmentId is required" },
        { status: 400 }
      );
    }

    if (day === undefined || day === null) {
      return NextResponse.json(
        { status: "error", message: "day is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { status: "error", message: "status is required" },
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

    // Calculate booster date from day offset
    const boosterDate = new Date(workshop.scheduledStartDate);
    boosterDate.setDate(boosterDate.getDate() + day);

    // Determine completion status
    const isCompleted = status === "COMPLETED";
    const completedAt = isCompleted ? new Date() : null;

    // Update booster
    const booster = await prisma.workshopBooster.upsert({
      where: {
        enrollmentId_boosterDay: {
          enrollmentId,
          boosterDay: day,
        },
      },
      create: {
        enrollmentId,
        boosterDay: day,
        boosterDate,
        status: status,
        completedAt,
        completionNotes: parentResponse || null,
        requiresEscalation: mentorEscalation ? true : false,
        escalationReason: mentorEscalation || null,
        sentAt: status !== "PENDING" ? new Date() : null,
      },
      update: {
        status,
        completedAt,
        completionNotes: parentResponse || null,
        requiresEscalation: mentorEscalation ? true : false,
        escalationReason: mentorEscalation || null,
        sentAt: status !== "PENDING" ? new Date() : null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        enrollmentId: true,
        boosterDay: true,
        boosterDate: true,
        status: true,
        sentAt: true,
        completedAt: true,
        completionNotes: true,
        requiresEscalation: true,
        escalationReason: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: booster,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/admin/workshops/[workshopId]/boosters]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update booster status",
      },
      { status: 500 }
    );
  }
}
