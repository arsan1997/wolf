const PLAYER_ID_KEY = 'werewolf_player_id';
const PLAYER_NAME_KEY = 'werewolf_player_name';

export const getStoredPlayerId = () => {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = `player_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
};

export const getStoredPlayerName = () => {
  return localStorage.getItem(PLAYER_NAME_KEY) || '';
};

export const setStoredPlayerName = (name) => {
  if (name) {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  }
};
