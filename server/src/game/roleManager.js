import { ROLES } from '../constants/roles.js';

export const assignRoles = (players) => {
  const count = players.length;
  if (count < 5 || count > 6) {
    throw new Error('เกมต้องมีผู้เล่นจำนวน 5 ถึง 6 คน');
  }

  // Define role deck
  const roleDeck = [
    ROLES.WEREWOLF,
    ROLES.SEER,
    ROLES.DOCTOR,
    ROLES.VILLAGER,
    ROLES.VILLAGER
  ];

  if (count === 6) {
    roleDeck.push(ROLES.VILLAGER);
  }

  // Shuffle roles (Fisher-Yates)
  for (let i = roleDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roleDeck[i], roleDeck[j]] = [roleDeck[j], roleDeck[i]];
  }

  // Assign to players
  return players.map((player, index) => ({
    ...player,
    role: roleDeck[index],
    isAlive: true,
    hasConfirmedRole: false,
    hasSubmittedNightAction: false,
    hasConfirmedDayResult: false,
    hasVoted: false,
    hasConfirmedVoteResult: false
  }));
};
