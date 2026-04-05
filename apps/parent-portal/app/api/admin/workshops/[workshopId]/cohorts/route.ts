/**
 * GET /api/admin/workshops/[workshopId]/cohorts
 * List all cohorts for a workshop
 *
 * POST /api/admin/workshops/[workshopId]/cohorts
 * Create a new cohort for a workshop
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

    const cohorts = await prisma.workshopCohort.findMany({
      where: { workshopId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        maxFamilies: true,
        createdAt: true,
        updatedAt: true,
        enrollments: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formattedCohorts = cohorts.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
      maxFamilies: c.maxFamilies,
      enrollmentCount: c.enrollments.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({
      status: "success",
      data: formattedCohorts,
      count: formattedCohorts.length,
    });
  } catch (error) {
    console.error("[GET /api/admin/workshops/[workshopId]/cohorts]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch cohorts",
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
    const { name, ageBand, maxSize } = body;

    if (!name) {
      return NextResponse.json(
        { status: "error", message: "Cohort name is required" },
        { status: 400 }
      );
    }

    // Verify workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { id: true, status: true },
    });

    if (!workshop) {
      return NextResponse.json(
        { status: "error", message: "Workshop not found" },
        { status: 404 }
      );
    }

    // Create cohort
    const cohort = await prisma.workshopCohort.create({
      data: {
        workshopId,
        name,
        description: ageBand || null,
        maxFamilies: maxSize || null,
        status: workshop.status,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        maxFamilies: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: cohort,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/workshops/[workshopId]/cohorts]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create cohort",
      },
      { status: 500 }
    );
  }
}
