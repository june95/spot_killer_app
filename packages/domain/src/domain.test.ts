import assert from "node:assert/strict";
import test from "node:test";
import {
  groupRoleSchema,
  parseDbSpotRow,
  spotMemoSchema,
  spotPhotoSchema,
  spotSchema,
} from "./index";

const ids = {
  group: "11111111-1111-4111-8111-111111111111",
  spot: "22222222-2222-4222-8222-222222222222",
  user: "33333333-3333-4333-8333-333333333333",
  memo: "44444444-4444-4444-8444-444444444444",
  photo: "55555555-5555-4555-8555-555555555555",
};

const now = "2026-05-10T10:00:00.000Z";

const validSpot = {
  id: ids.spot,
  groupId: ids.group,
  createdByUserId: ids.user,
  name: "첫 번째 Spot",
  category: "restaurant",
  revisitIntent: "would-revisit",
  markerMeaning: "good",
  rating: 4,
  address: "서울시 중구 세종대로 110",
  coordinates: {
    latitude: 37.5665,
    longitude: 126.978,
  },
  externalUrl: "https://example.com/spot",
  createdAt: now,
  updatedAt: now,
};

test("spot schema accepts a valid MVP spot", () => {
  assert.equal(spotSchema.parse(validSpot).name, "첫 번째 Spot");
});

test("spot schema rejects empty names", () => {
  assert.equal(spotSchema.safeParse({ ...validSpot, name: " " }).success, false);
});

test("spot schema rejects invalid coordinates", () => {
  assert.equal(
    spotSchema.safeParse({
      ...validSpot,
      coordinates: { latitude: 91, longitude: 126.978 },
    }).success,
    false,
  );
});

test("spot schema rejects invalid dates and URLs", () => {
  assert.equal(spotSchema.safeParse({ ...validSpot, createdAt: "today" }).success, false);
  assert.equal(spotSchema.safeParse({ ...validSpot, externalUrl: "not-a-url" }).success, false);
});

test("group roles match database RLS roles", () => {
  assert.equal(groupRoleSchema.safeParse("editor").success, true);
  assert.equal(groupRoleSchema.safeParse("admin").success, false);
});

test("memo and photo schemas cover core child records", () => {
  assert.equal(
    spotMemoSchema.safeParse({
      id: ids.memo,
      spotId: ids.spot,
      authorUserId: ids.user,
      body: "다음에는 창가 자리에 앉기",
      createdAt: now,
      updatedAt: now,
    }).success,
    true,
  );

  assert.equal(
    spotPhotoSchema.safeParse({
      id: ids.photo,
      spotId: ids.spot,
      uploadedByUserId: ids.user,
      bucket: "spot-photos",
      storagePath: "groups/111/spots/222/555.jpg",
      width: 1200,
      height: 900,
      publicUrl: "https://example.com/photo.jpg",
      createdAt: now,
    }).success,
    true,
  );
});

test("DB spot rows stay separate and parse into domain spots", () => {
  const spot = parseDbSpotRow({
    id: ids.spot,
    group_id: ids.group,
    created_by_user_id: ids.user,
    name: "DB Spot",
    category: "cafe",
    revisit_intent: "must-revisit",
    marker_meaning: "strong-recommend",
    rating: null,
    address: null,
    latitude: 37.5,
    longitude: 127,
    external_url: null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  });

  assert.deepEqual(spot.coordinates, { latitude: 37.5, longitude: 127 });
  assert.equal(spot.rating, undefined);
});
