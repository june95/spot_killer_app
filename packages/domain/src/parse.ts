import {
  dbGroupMemberRowSchema,
  dbGroupRowSchema,
  groupMemberSchema,
  groupSchema,
  type Group,
  type GroupMember,
} from "./group";
import {
  dbSpotMemoRowSchema,
  dbSpotPhotoRowSchema,
  dbSpotRowSchema,
  spotMemoSchema,
  spotPhotoSchema,
  spotSchema,
  type Spot,
  type SpotMemo,
  type SpotPhoto,
} from "./spot";

export function parseSpot(value: unknown): Spot {
  return spotSchema.parse(value);
}

export function parseSpotMemo(value: unknown): SpotMemo {
  return spotMemoSchema.parse(value);
}

export function parseSpotPhoto(value: unknown): SpotPhoto {
  return spotPhotoSchema.parse(value);
}

export function parseGroup(value: unknown): Group {
  return groupSchema.parse(value);
}

export function parseGroupMember(value: unknown): GroupMember {
  return groupMemberSchema.parse(value);
}

export function parseDbSpotRow(value: unknown): Spot {
  const row = dbSpotRowSchema.parse(value);

  return spotSchema.parse({
    id: row.id,
    groupId: row.group_id,
    createdByUserId: row.created_by_user_id,
    name: row.name,
    category: row.category,
    revisitIntent: row.revisit_intent,
    markerMeaning: row.marker_meaning,
    rating: row.rating ?? undefined,
    address: row.address ?? undefined,
    coordinates: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    externalUrl: row.external_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  });
}

export function parseDbSpotMemoRow(value: unknown): SpotMemo {
  const row = dbSpotMemoRowSchema.parse(value);

  return spotMemoSchema.parse({
    id: row.id,
    spotId: row.spot_id,
    authorUserId: row.author_user_id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  });
}

export function parseDbSpotPhotoRow(value: unknown): SpotPhoto {
  const row = dbSpotPhotoRowSchema.parse(value);

  return spotPhotoSchema.parse({
    id: row.id,
    spotId: row.spot_id,
    uploadedByUserId: row.uploaded_by_user_id,
    bucket: row.bucket,
    storagePath: row.storage_path,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    altText: row.alt_text ?? undefined,
    publicUrl: row.public_url ?? undefined,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  });
}

export function parseDbGroupRow(value: unknown): Group {
  const row = dbGroupRowSchema.parse(value);

  return groupSchema.parse({
    id: row.id,
    name: row.name,
    createdByUserId: row.created_by_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function parseDbGroupMemberRow(value: unknown): GroupMember {
  const row = dbGroupMemberRowSchema.parse(value);

  return groupMemberSchema.parse({
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
  });
}
