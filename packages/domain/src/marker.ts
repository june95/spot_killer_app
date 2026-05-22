import { z } from "zod";

export const markerMeaningSchema = z.enum([
  "strong-recommend",
  "good",
  "okay",
  "memory",
  "reconsider",
  "special-day",
  "low-revisit",
]);

export const markerColorNameSchema = z.enum([
  "heart-red",
  "heart-orange",
  "heart-yellow",
  "heart-green",
  "heart-blue",
  "heart-purple",
  "heart-black",
]);

export const markerEmojiSchema = z.enum(["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤"]);

export const markerPresetSchema = z.object({
  key: markerMeaningSchema,
  emoji: markerEmojiSchema,
  label: z.string().trim().min(1).max(32),
  colorName: markerColorNameSchema,
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export type MarkerMeaning = z.infer<typeof markerMeaningSchema>;
export type MarkerColorName = z.infer<typeof markerColorNameSchema>;
export type MarkerEmoji = z.infer<typeof markerEmojiSchema>;
export type MarkerPreset = z.infer<typeof markerPresetSchema>;
