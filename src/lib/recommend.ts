import { IScholarship, IUser } from "@/types";

export function scoreScholarship(user: IUser, scholarship: IScholarship): number {
  let score = 0;
  const p = user.profile;

  if (!p) return 0;

  const eduLevels = scholarship.eligibility.educationLevel.map((e) => e.toLowerCase());
  const fields = scholarship.eligibility.fieldOfStudy.map((f) => f.toLowerCase());
  const states = scholarship.eligibility.states.map((s) => s.toLowerCase());

  // Education level match (+3)
  if (p.educationLevel && (eduLevels.includes(p.educationLevel.toLowerCase()) || eduLevels.includes("all")))
    score += 3;

  // Field of study match (+3)
  if (p.fieldOfStudy && (fields.includes(p.fieldOfStudy.toLowerCase()) || fields.includes("all")))
    score += 3;

  // State match (+2)
  if (p.state && (states.includes(p.state.toLowerCase()) || states.includes("all india")))
    score += 2;

  // Deadline not expired (+1)
  if (new Date(scholarship.deadline) >= new Date()) score += 1;

  // Featured bonus (+1)
  if (scholarship.featured) score += 1;

  return score;
}

export function getRecommended(user: IUser, scholarships: IScholarship[], limit = 6): IScholarship[] {
  return scholarships
    .map((s) => ({ scholarship: s, score: scoreScholarship(user, s) }))
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ scholarship }) => scholarship);
}
