/**
 * POST /api/admin/workshops/[workshopId]/enroll
 * Enroll a family in a workshop cohort
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
    const {
      cohortId,
      parentUserId,
      teenName,
      teenAge,
      consentGiven,
      intakeCompleted,
      safetyCleared,
    } = body;

    // Validate required fields
    if (!cohortId) {
      return NextResponse.json(
        { status: "error", message: "cohortId is required" },
        { status: 400 }
      );
    }

    if (!parentUserId) {
      return NextResponse.json(
        { status: "error", message: "parentUserId is required" },
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

    // Verify cohort exists and belongs to this workshop
    const cohort = await prisma.workshopCohort.findFirst({
      where: {
        id: cohortId,
        workshopId,
      },
      select: { id: true, maxFamilies: true, _count: { select: { enrollments: true } } },
    });

    if (!cohort) {
      return NextResponse.json(
        { status: "error", message: "Cohort not found in this workshop" },
        { status: 404 }
      );
    }

    // Check capacity
    if (cohort.maxFamilies && cohort._count.enrollments >= cohort.maxFamilies) {
      return NextResponse.json(
        { status: "error", message: "Cohort is at maximum capacity" },
        { status: 400 }
      );
    }

    // Verify parent user exists
    const parentUser = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { id: true },
    });

    if (!parentUser) {
      return NextResponse.json(
        { status: "error", message: "Parent user not found" },
        { status: 404 }
      );
    }

    // Check for duplicate enrollment
    const existingEnrollment = await prisma.workshopEnrollment.findUnique({
      where: {
        cohortId_parentUserId: {
          cohortId,
          parentUserId,
        },
      },
      select: { id: true },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { status: "error", message: "Parent is already enrolled in this cohort" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.workshopEnrollment.create({
      data: {
        cohortId,
        parentUserId,
        status: "PENDING",
        consentGrantedAt: consentGiven ? new Date() : null,
        intakeCompletedAt: intakeCompleted ? new Date() : null,
        triageCompletedAt: safetyCleared ? new Date() : null,
      },
      select: {
        id: true,
        status: true,
        consentGrantedAt: true,
        intakeCompletedAt: true,
        triageCompletedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: {
          enrollmentId: enrollment.id,
          status: enrollment.status,
          consentGrantedAt: enrollment.consentGrantedAt,
          intakeCompletedAt: enrollment.intakeCompletedAt,
          triageCompletedAt: enrollment.triageCompletedAt,
          createdAt: enrollment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/workshops/[workshopId]/enroll]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to enroll family",
      },
      { status: 500 }
    );
  }
}
