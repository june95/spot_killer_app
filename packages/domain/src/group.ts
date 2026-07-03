import { z } from "zod";
import { isoDateTimeSchema, uuidSchema } from "./primitives";

// Keep client validation aligned with the database RLS roles.
export const groupRoleSchema = z.enum(["owner", "editor", "viewer"]);

export const groupSchema = z.object({
  id: uuidSchema,
  name: z.string().trim().min(1).max(80),
  createdByUserId: uuidSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const groupMemberSchema = z.object({
  id: uuidSchema,
  groupId: uuidSchema,
  userId: uuidSchema,
  role: groupRoleSchema,
  joinedAt: isoDateTimeSchema,
});

export const dbGroupRowSchema = z.object({
  id: uuidSchema,
  name: z.string().trim().min(1).max(80),
  created_by_user_id: uuidSchema,
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
});

export const dbGroupMemberRowSchema = z.object({
  id: uuidSchema,
  group_id: uuidSchema,
  user_id: uuidSchema,
  role: groupRoleSchema,
  joined_at: isoDateTimeSchema,
});

export type GroupRole = z.infer<typeof groupRoleSchema>;
export type Group = z.infer<typeof groupSchema>;
export type GroupMember = z.infer<typeof groupMemberSchema>;
export type DbGroupRow = z.infer<typeof dbGroupRowSchema>;
export type DbGroupMemberRow = z.infer<typeof dbGroupMemberRowSchema>;
