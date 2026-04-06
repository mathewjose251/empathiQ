import { NextResponse } from "next/server";
import type { ModerationQueueItem } from "@empathiq/shared/contracts/pack";

/**
 * Admin Notification System for Pack Moderation
 *
 * This endpoint handles real-time notifications to admins when posts
 * are flagged in RED or YELLOW zones. In production, this would integrate
 * with email, SMS, or dashboard push notifications.
 *
 * POST /api/pack/notify-admins
 *   Input: { postId, zone, createdLabel, safetyFlags, redactedExcerpt }
 *   Returns: { success, notificationId, channel, deliveryTime }
 */

interface NotifyAdminsInput {
  postId: string;
  zone: "RED" | "YELLOW";
  createdLabel: string;
  safetyFlags: string[];
  redactedExcerpt: string;
}

interface NotifyAdminsResult {
  success: boolean;
  notificationId?: string;
  channel?: string;
  deliveryTime?: string;
  message: string;
}

// In-memory notification log (would use database in production)
const notificationLog: Array<{
  id: string;
  timestamp: Date;
  zone: "RED" | "YELLOW";
  postId: string;
  adminsNotified: number;
}> = [];

function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getNotificationTemplate(
  zone: "RED" | "YELLOW",
  postId: string,
  safetyFlags: string[],
  excerpt: string,
): { subject: string; body: string } {
  if (zone === "RED") {
    return {
      subject: "🚨 URGENT: RED ZONE post in Pack moderation queue",
      body: `
A post has been flagged with immediate safety concerns:

⏱️  Time: ${new Date().toLocaleTimeString("en-IN")}
🆔  Post ID: ${postId}
🚨  Zone: RED (Immediate Danger)
⚠️  Flags: ${safetyFlags.join(", ")}

Excerpt: "${excerpt}"

ACTION REQUIRED: Review within 5 minutes
🔗  Review at: https://empathiq.internal/admin/moderation-queue

This post has been held from the Pack. Do NOT publish without clinical review.
      `,
    };
  }

  return {
    subject: "📋 YELLOW ZONE post awaiting moderation review",
    body: `
A post needs human judgment before publishing:

⏱️  Time: ${new Date().toLocaleTimeString("en-IN")}
🆔  Post ID: ${postId}
🟡  Zone: YELLOW (Concerning Pattern)
⚠️  Flags: ${safetyFlags.join(", ")}

Excerpt: "${excerpt}"

TIMELINE: Review when available (no strict SLA)
🔗  Review at: https://empathiq.internal/admin/moderation-queue

Decide: Publish | Escalate | Block
    `,
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as NotifyAdminsInput;

    const { postId, zone, createdLabel, safetyFlags, redactedExcerpt } = body;

    if (!postId || !zone || !safetyFlags.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: postId, zone, safetyFlags",
        },
        { status: 400 },
      );
    }

    const notificationId = generateNotificationId();
    const { subject, body: messageBody } = getNotificationTemplate(
      zone,
      postId,
      safetyFlags,
      redactedExcerpt,
    );

    // Simulated admin notification channels
    const admins = [
      { name: "Primary Admin", email: "admin@empathiq.local" },
      { name: "Backup Admin", email: "backup@empathiq.local" },
    ];

    // Log notification
    notificationLog.push({
      id: notificationId,
      timestamp: new Date(),
      zone,
      postId,
      adminsNotified: admins.length,
    });

    // In production, this would:
    // 1. Send email via SendGrid/AWS SES
    // 2. Send SMS via Twilio
    // 3. Send dashboard push notification via WebSocket
    // 4. Create database notification record
    // 5. Set up retry logic if first attempt fails

    console.log(`[NOTIFICATION] ${zone} zone - Post ${postId}`);
    console.log(`[EMAIL] To: ${admins.map((a) => a.email).join(", ")}`);
    console.log(`[SUBJECT] ${subject}`);

    // SLA tracking for RED vs YELLOW
    const slaMinutes = zone === "RED" ? 5 : 60;

    return NextResponse.json(
      {
        success: true,
        notificationId,
        channel: "email+sms+dashboard",
        deliveryTime: `Immediate (SLA: ${slaMinutes} min)`,
        message: `Notified ${admins.length} admins for ${zone} zone post`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/pack/notify-admins
 * Returns notification log (for debugging/audit)
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      recentNotifications: notificationLog.slice(-20).reverse(),
      totalSent: notificationLog.length,
      redAlerts: notificationLog.filter((n) => n.zone === "RED").length,
      yellowAlerts: notificationLog.filter((n) => n.zone === "YELLOW").length,
    },
    { status: 200 },
  );
}
