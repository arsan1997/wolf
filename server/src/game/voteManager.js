export const processVotes = (room) => {
  const { players, votes } = room;
  const alivePlayers = players.filter((p) => p.isAlive);

  // Initialize count for all alive players
  const tally = {};
  alivePlayers.forEach((p) => {
    tally[p.id] = 0;
  });

  // Tally votes
  Object.values(votes).forEach((targetId) => {
    if (tally[targetId] !== undefined) {
      tally[targetId] += 1;
    }
  });

  let maxVotes = -1;
  let candidates = [];

  Object.entries(tally).forEach(([playerId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      candidates = [playerId];
    } else if (count === maxVotes && maxVotes > 0) {
      candidates.push(playerId);
    }
  });

  if (maxVotes === 0 || candidates.length > 1) {
    // Tie or no votes cast
    return {
      tally,
      isTie: true,
      eliminatedPlayer: null,
      message: maxVotes === 0 ? 'ไม่มีผู้ได้รับการโหวต' : 'ผลคะแนนโหวตเท่ากัน! ไม่มีผู้เล่นถูกกำจัด'
    };
  }

  const eliminatedId = candidates[0];
  const eliminatedPlayer = players.find((p) => p.id === eliminatedId);
  if (eliminatedPlayer) {
    eliminatedPlayer.isAlive = false;
  }

  return {
    tally,
    isTie: false,
    eliminatedPlayer: eliminatedPlayer
      ? {
          id: eliminatedPlayer.id,
          name: eliminatedPlayer.name,
          role: eliminatedPlayer.role
        }
      : null,
    message: `ผู้เล่น ${eliminatedPlayer?.name} ได้รับคะแนนโหวตสูงสุดและถูกกำจัดออกจากหมู่บ้าน!`
  };
};
