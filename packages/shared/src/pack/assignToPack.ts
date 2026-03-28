export interface PackCandidate {
  id: string;
  currentMemberCount: number;
  ageBand: "13-15" | "16-18";
  primaryNeeds: string[];
  active: boolean;
}

export interface TeenPlacementProfile {
  teenId: string;
  age: number;
  supportNeeds: string[];
}

export interface PackAssignmentResult {
  packId: string | null;
  reason: string;
}

export function assignTeenToPack(
  profile: TeenPlacementProfile,
  packs: PackCandidate[],
): PackAssignmentResult {
  const targetAgeBand = profile.age <= 15 ? "13-15" : "16-18";

  const eligiblePacks = packs
    .filter((pack) => pack.active)
    .filter((pack) => pack.currentMemberCount >= 6 && pack.currentMemberCount < 8)
    .filter((pack) => pack.ageBand === targetAgeBand)
    .map((pack) => ({
      pack,
      overlapScore: pack.primaryNeeds.filter((need) =>
        profile.supportNeeds.includes(need),
      ).length,
    }))
    .sort((left, right) => {
      if (right.overlapScore !== left.overlapScore) {
        return right.overlapScore - left.overlapScore;
      }

      return left.pack.currentMemberCount - right.pack.currentMemberCount;
    });

  const bestMatch = eligiblePacks[0]?.pack;

  if (!bestMatch) {
    return {
      packId: null,
      reason: "No active pack with 6-8 peers matched the teen's age band and support needs.",
    };
  }

  return {
    packId: bestMatch.id,
    reason: "Assigned to the closest active closed cohort with available capacity and matching needs.",
  };
}
