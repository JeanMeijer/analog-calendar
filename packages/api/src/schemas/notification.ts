import z from "zod";

import { notificationTypeEnum } from "@repo/db/schema";

import { paginationRequest } from "./pagination";

export const notificationPaginationRequest = paginationRequest.extend({
  read: z.boolean().optional(), // Filter by read status
  type: z.enum(notificationTypeEnum.enumValues).optional(),
});

export const notificationMarkAsReadRequest = z.object({
  id: z.string().uuid(), // Notification ID to mark as read
});

export const notificationSubcribeRequest = z.object({
  endpoint: z.string(), // Push subscription endpoint
  expirationTime: z.number().nullish(), // Optional expiration time
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }), // Keys for the push subscription
});

export const notificationCreateRequest = z.object({
  type: z.enum(notificationTypeEnum.enumValues), // Type of notification
  title: z.string(), // Title of the notification
  body: z.string(), // Body text of the notification
  data: z.record(z.any()).optional(), // Additional data for the notification
  sourceId: z.string().uuid().optional(), // Optional source ID for the notification
  eventId: z.string().optional(), // Optional event ID if the notification is related to an event
});
