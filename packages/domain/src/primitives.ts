import { z } from "zod";

export const uuidSchema = z.uuid();
export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const urlSchema = z.url().max(2_048);

export const latitudeSchema = z.number().finite().min(-90).max(90);
export const longitudeSchema = z.number().finite().min(-180).max(180);

export const coordinatesSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
