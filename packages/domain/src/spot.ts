import { z } from "zod";
import { markerMeaningSchema } from "./marker";
import {
  coordinatesSchema,
  isoDateTimeSchema,
  urlSchema,
  uuidSchema,
} from "./primitives";

export const spotCategorySchema = z.enum([
  "restaurant",
  "cafe",
  "bar",
  "shop",
  "culture",
  "outdoor",
  "lodging",
  "other",
]);

export const revisitIntentSchema = z.enum([
  "must-revisit",
  "would-revisit",
  "maybe",
  "avoid",
]);

export const spotSchema = z.object({
  id: uuidSchema,
  groupId: uuidSchema,
  createdByUserId: uuidSchema,
  name: z.string().trim().min(1).max(120),
  category: spotCategorySchema,
  revisitIntent: revisitIntentSchema,
  markerMeaning: markerMeaningSchema,
  rating: z.number().int().min(1).max(5).optional(),
  address: z.string().trim().min(1).max(240).optional(),
  coordinates: coordinatesSchema,
  externalUrl: urlSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  deletedAt: isoDateTimeSchema.nullable().optional(),
});

export const spotMemoSchema = z.object({
  id: uuidSchema,
  spotId: uuidSchema,
  authorUserId: uuidSchema,
  body: z.string().trim().min(1).max(2_000),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  deletedAt: isoDateTimeSchema.nullable().optional(),
});

export const spotPhotoSchema = z.object({
  id: uuidSchema,
  spotId: uuidSchema,
  uploadedByUserId: uuidSchema,
  bucket: z.literal("spot-photos"),
  storagePath: z.string().trim().min(1).max(1_024),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  altText: z.string().trim().max(160).optional(),
  publicUrl: urlSchema.optional(),
  createdAt: isoDateTimeSchema,
  deletedAt: isoDateTimeSchema.nullable().optional(),
});

export const dbSpotRowSchema = z.object({
  id: uuidSchema,
  group_id: uuidSchema,
  created_by_user_id: uuidSchema,
  name: z.string().trim().min(1).max(120),
  category: spotCategorySchema,
  revisit_intent: revisitIntentSchema,
  marker_meaning: markerMeaningSchema,
  rating: z.number().int().min(1).max(5).nullable(),
  address: z.string().trim().min(1).max(240).nullable(),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
  external_url: urlSchema.nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
  deleted_at: isoDateTimeSchema.nullable(),
});

export const dbSpotMemoRowSchema = z.object({
  id: uuidSchema,
  spot_id: uuidSchema,
  author_user_id: uuidSchema,
  body: z.string().trim().min(1).max(2_000),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
  deleted_at: isoDateTimeSchema.nullable(),
});

export const dbSpotPhotoRowSchema = z.object({
  id: uuidSchema,
  spot_id: uuidSchema,
  uploaded_by_user_id: uuidSchema,
  bucket: z.literal("spot-photos"),
  storage_path: z.string().trim().min(1).max(1_024),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  alt_text: z.string().trim().max(160).nullable(),
  public_url: urlSchema.nullable(),
  created_at: isoDateTimeSchema,
  deleted_at: isoDateTimeSchema.nullable(),
});

export type SpotCategory = z.infer<typeof spotCategorySchema>;
export type RevisitIntent = z.infer<typeof revisitIntentSchema>;
export type Spot = z.infer<typeof spotSchema>;
export type SpotMemo = z.infer<typeof spotMemoSchema>;
export type SpotPhoto = z.infer<typeof spotPhotoSchema>;
export type DbSpotRow = z.infer<typeof dbSpotRowSchema>;
export type DbSpotMemoRow = z.infer<typeof dbSpotMemoRowSchema>;
export type DbSpotPhotoRow = z.infer<typeof dbSpotPhotoRowSchema>;
