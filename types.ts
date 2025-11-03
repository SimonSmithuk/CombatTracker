export interface Character {
  id: string;
  name: string;
  armorClass: number;
  hitPoints: number;
  maxHitPoints: number;
  temporaryHitPoints: number;
  initiative: number;
  conditions: string[];
}

export interface Game {
  id: string; // Game Code
  characters: Character[];
  currentTurnPlayerId: string | null;
  isCombatActive: boolean;
}

export type Role = 'dm' | 'player';

// Types for WebSocket communication
export type ClientMessage =
  | { type: 'JOIN_GAME'; payload: { gameCode: string } }
  | { type: 'UPDATE_GAME'; payload: Game }
  | { type: 'CONFIGURE_POLLING'; payload: { gameCode: string; interval: number } };

export type ServerMessage =
  | { type: 'GAME_STATE'; payload: Game }
  | { type: 'ERROR'; payload: string };