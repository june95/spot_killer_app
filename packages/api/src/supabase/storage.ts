export const storageBuckets = {
  spotPhotos: "spot-photos",
} as const;

export const storagePathPatterns = {
  spotPhoto: "groups/{groupId}/spots/{spotId}/{photoId}",
} as const;
