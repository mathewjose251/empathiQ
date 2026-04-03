/**
 * GET /api/admin/workshops
 * List all workshops with status, cohort count, enrollment count
 *
 * POST /api/admin/workshops
 * Create a new workshop
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";

export async function GET(request: NextRequest) {
  try {
    const workshops = await prisma.workshop.findMany({
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
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedWorkshops = workshops.map((ws) => ({
      id: ws.id,
      title: ws.title,
      description: ws.description,
      status: ws.status,
      scheduledStartDate: ws.scheduledStartDate,
      scheduledEndDate: ws.scheduledEndDate,
      location: ws.location,
      facilitatorId: ws.facilitatorId,
      maxParticipants: ws.maxParticipants,
      cohortCount: ws.cohorts.length,
      enrollmentCount: ws.cohorts.reduce((sum, c) => sum + c._count.enrollments, 0),
      createdAt: ws.createdAt,
      updatedAt: ws.updatedAt,
    }));

    return NextResponse.json({
      status: "success",
      data: formattedWorkshops,
      count: formattedWorkshops.length,
    });
  } catch (error) {
    console.error("[GET /api/admin/workshops]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch workshops",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, description, startDate, endDate, location, maxFamilies, facilitatorName } = body;

    if (!title) {
      return NextResponse.json(
        { status: "error", message: "Title is required" },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { status: "error", message: "Start date is required" },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { status: "error", message: "End date is required" },
        { status: 400 }
      );
    }

    // Create the workshop
    const workshop = await prisma.workshop.create({
      data: {
        title,
        description: description || null,
        scheduledStartDate: new Date(startDate),
        scheduledEndDate: new Date(endDate),
        location: location || null,
        maxParticipants: maxFamilies || null,
        // facilitatorName is stored as facilitatorId in the schema
        // In Phase 2, we can enhance this to create/link actual facilitator users
        facilitatorId: facilitatorName || null,
        status: "PLANNING",
      },
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
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: workshop,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/workshops]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create workshop",
      },
      { status: 500 }
    );
  }
}
