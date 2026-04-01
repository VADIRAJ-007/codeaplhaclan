// AI-Based Team Matching Algorithm for CrossForge

function intersection(a, b) { return a.filter(x => b.includes(x)); }
function union(a, b) { return [...new Set([...a, ...b])]; }

export function calculateCompatibility(p1, p2) {
  const s = {};
  s.departmentDiversity = p1.department !== p2.department ? 100 : 20;

  const shared = intersection(p1.skills, p2.skills);
  const total = union(p1.skills, p2.skills);
  s.skillComplementarity = total.length > 0 ? (1 - shared.length / total.length) * 100 : 50;

  const si = intersection(p1.interests, p2.interests);
  const mi = Math.max(p1.interests.length, p2.interests.length, 1);
  s.interestOverlap = (si.length / mi) * 100;

  const ad = Math.abs(p1.availability - p2.availability);
  s.availabilityAlign = Math.max(0, 100 - ad * 10);

  const t = Math.round(s.departmentDiversity * 0.35 + s.skillComplementarity * 0.30 + s.interestOverlap * 0.25 + s.availabilityAlign * 0.10);

  return {
    total: Math.min(t, 99),
    breakdown: {
      departmentDiversity: Math.round(s.departmentDiversity),
      skillComplementarity: Math.round(s.skillComplementarity),
      interestOverlap: Math.round(s.interestOverlap),
      availabilityAlign: Math.round(s.availabilityAlign)
    }
  };
}

export function findMatches(userProfile, candidates) {
  return candidates
    .filter(c => c.id !== userProfile.id)
    .map(c => ({ profile: c, compatibility: calculateCompatibility(userProfile, c) }))
    .sort((a, b) => b.compatibility.total - a.compatibility.total);
}

export function suggestTeam(userProfile, candidates, teamSize = 3) {
  const matches = findMatches(userProfile, candidates);
  const team = [];
  const depts = new Set([userProfile.department]);
  for (const m of matches) {
    if (team.length >= teamSize) break;
    if (!depts.has(m.profile.department)) { team.push(m); depts.add(m.profile.department); }
  }
  for (const m of matches) {
    if (team.length >= teamSize) break;
    if (!team.find(t => t.profile.id === m.profile.id)) team.push(m);
  }
  return team;
}
