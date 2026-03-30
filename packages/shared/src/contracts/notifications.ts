export type NotificationChannel = 'PUSH' | 'EMAIL' | 'IN_APP';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';

export type NotificationTrigger =
  | 'MISSION_ARC_COMPLETED'
  | 'INSIGHT_SNAPSHOT_READY'
  | 'SESSION_SCHEDULED'
  | 'PACK_REFLECTION_POSTED'
  | 'COPARTICIPATION_CHALLENGE_AVAILABLE'
  | 'SAFETY_GATE_FLAG_RAISED'
  | 'ESCALATION_STATE_CHANGE'
  | 'PACK_COHESION_LOW'
  | 'REAL_WORLD_CHALLENGE_OVERDUE';

export interface NotificationPayload {
  id: string;
  recipientUserId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  sentAt?: string;
  readAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface NotificationTriggerPayload {
  trigger: NotificationTrigger;
  recipientUserId: string;
  channels: NotificationChannel[];
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    PUSH: boolean;
    EMAIL: boolean;
    IN_APP: boolean;
  };
  triggers: Partial<Record<NotificationTrigger, boolean>>;
}

export interface DeliveryConfirmation {
  notificationId: string;
  channel: NotificationChannel;
  status: 'SUCCESS' | 'FAILED' | 'BOUNCED';
  failureReason?: string;
  deliveredAt: string;
}

export interface NotificationLogPayload {
  id: string;
  escalationEventId?: string;
  recipientUserId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}
