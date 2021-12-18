export interface Player {
  id?: string,
  nickname: string,
  connected: boolean,
  score: number,
}

export interface Rules {
  type: 'drawer' | 'guesser',
  word: string | null;
}
