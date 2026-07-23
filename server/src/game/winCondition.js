import { ROLES } from '../constants/roles.js';

export const checkWinCondition = (players) => {
  const alivePlayers = players.filter((p) => p.isAlive);
  const aliveWerewolves = alivePlayers.filter((p) => p.role === ROLES.WEREWOLF);
  const aliveVillagers = alivePlayers.filter((p) => p.role !== ROLES.WEREWOLF);

  if (aliveWerewolves.length === 0) {
    return {
      winner: 'VILLAGER',
      reason: 'ฝ่ายชาวบ้านเป็นผู้ชนะ! มนุษย์หมาป่าถูกกำจัดจนหมดสิ้น'
    };
  }

  if (aliveWerewolves.length >= aliveVillagers.length) {
    return {
      winner: 'WEREWOLF',
      reason: 'ฝ่ายมนุษย์หมาป่าเป็นผู้ชนะ! จำนวนหมาป่ามีมากกว่าหรือเท่ากับชาวบ้าน'
    };
  }

  return null;
};
