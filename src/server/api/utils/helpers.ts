export interface ISplittedSongsInput {
  data: {
    songId: string;
    category: string;
  }[];
}

export interface ISplittedSongsOutput {
  songId: string;
  category: string;
}

export function isArrayOfSplittedSongsOutput(
  obj: any,
): obj is ISplittedSongsOutput[] {
  if (!Array.isArray(obj)) {
    return false;
  }

  for (const item of obj) {
    if (
      typeof item !== "object" ||
      !("songId" in item) ||
      typeof item.songId !== "string" ||
      !("category" in item) ||
      typeof item.category !== "string"
    ) {
      return false;
    }
  }

  return true;
}
