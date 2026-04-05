/**
 * GET /api/admin/workshops/[workshopId]
 * Get full workshop detail with cohorts, enrollments, and attendance stats
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

    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        scheduledStartDate: true,
        scheduledEndDate: true,
        location: true,
        facilitatorId: true,
        maxParticipants: true,
        createdAt: true,
        updatedAt: true,
        cohorts: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            maxFamilies: true,
            createdAt: true,
            enrollments: {
              select: {
                id: true,
                status: true,
                consentGrantedAt: true,
                intakeCompletedAt: true,
                triageCompletedAt: true,
                _count: {
                  select: {
                    attendanceRecords: true,
                    boosters: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!workshop) {
      return NextResponse.json(
        { status: "error", message: "Workshop not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalEnrollments = workshop.cohorts.reduce(
      (sum, c) => sum + c.enrollments.length,
      0
    );

    const totalAttendanceRecords = workshop.cohorts.reduce(
      (sum, c) =>
        sum +
        c.enrollments.reduce(
          (eSum, e) => eSum + e._count.attendanceRecords,
          0
        ),
      0
    );

    const totalBoosterCheckpoints = workshop.cohorts.reduce(
      (sum, c) =>
        sum +
        c.enrollments.reduce((eSum, e) => eSum + e._count.boosters, 0),
      0
    );

    const formattedWorkshop = {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      status: workshop.status,
      scheduledStartDate: workshop.scheduledStartDate,
      scheduledEndDate: workshop.scheduledEndDate,
      location: workshop.location,
      facilitatorId: workshop.facilitatorId,
      maxParticipants: workshop.maxParticipants,
      createdAt: workshop.createdAt,
      updatedAt: workshop.updatedAt,
      cohorts: workshop.cohorts.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        status: c.status,
        maxFamilies: c.maxFamilies,
        enrollmentCount: c.enrollments.length,
        createdAt: c.createdAt,
      })),
      stats: {
        totalEnrollments,
        totalAttendanceRecords,
        totalBoosterCheckpoints,
      },
    };

    return NextResponse.json({
      status: "success",
      data: formattedWorkshop,
    });
  } catch (error) {
    console.error("[GET /api/admin/workshops/[workshopId]]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch workshop details",
      },
      { status: 500 }
    );
  }
}
