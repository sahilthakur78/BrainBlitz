const BADGES = [
  { id: 'first-blood',  name: 'First Blood',   icon: '⚔️',  condition: u => u.solvedChallenges.length >= 1 },
  { id: 'speed-demon',  name: 'Speed Demon',   icon: '⚡',  condition: u => u.skills.javascript >= 10 },
  { id: 'week-warrior', name: 'Week Warrior',  icon: '🔥',  condition: u => u.streak >= 7 },
  { id: 'centurion',    name: 'Centurion',     icon: '💯',  condition: u => u.solvedChallenges.length >= 100 },
  { id: 'boss-slayer',  name: 'Boss Slayer',   icon: '👑',  condition: u => u.battleStats.wins >= 1 },
  { id: 'xp-hunter',    name: 'XP Hunter',     icon: '✨',  condition: u => u.xp >= 1000 },
  { id: 'veteran',      name: 'Veteran',       icon: '🛡️',  condition: u => u.level >= 10 },
  { id: 'polyglot',     name: 'Polyglot',      icon: '🌐',  condition: u => Object.values(u.skills).filter(s => s >= 20).length >= 3 },
  { id: 'blitz-master', name: 'Blitz Master',  icon: '🧠',  condition: u => u.xp >= 5000 },
];

export const checkAndAwardBadges = async (user) => {
  const newBadges = [];
  const existing = user.badges.map(b => b.id);
  for (const badge of BADGES) {
    if (!existing.includes(badge.id) && badge.condition(user)) {
      user.badges.push({ id: badge.id, name: badge.name, icon: badge.icon });
      newBadges.push(badge);
    }
  }
  return newBadges;
};
