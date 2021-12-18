export interface Player {
  id?: string,
  nickname: string,
  connected: boolean,
  score: number,
}

export interface Rules {
  type: 'drawer' | 'guesser',
  word: string;
}

export interface RulesRequest {
  rules: Rules,
  players: { id: string, name: string }[],
}

export interface Message {
  name: string,
  message: string,
}
