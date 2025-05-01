import { GameHistory } from '../../../html/js/engine/GameHistory.js';

describe('GameHistory', () => {
  let gameHistory;
  
  beforeEach(() => {
    gameHistory = new GameHistory();
  });

  test('should initialize with empty completed games array', () => {
    expect(gameHistory.completedGames).toEqual([]);
  });

  test('should save a game state', () => {
    const mockGameState = { score: 100, answeredQuestions: [] };
    
    gameHistory.saveGame(mockGameState);
    
    expect(gameHistory.completedGames.length).toBe(1);
    expect(gameHistory.completedGames[0]).toBe(mockGameState);
  });

  test('should save multiple game states', () => {
    const mockGameState1 = { score: 100, answeredQuestions: [] };
    const mockGameState2 = { score: 200, answeredQuestions: [] };
    
    gameHistory.saveGame(mockGameState1);
    gameHistory.saveGame(mockGameState2);
    
    expect(gameHistory.completedGames.length).toBe(2);
    expect(gameHistory.completedGames[0]).toBe(mockGameState1);
    expect(gameHistory.completedGames[1]).toBe(mockGameState2);
  });

  test('should get the last completed game', () => {
    const mockGameState1 = { score: 100, answeredQuestions: [] };
    const mockGameState2 = { score: 200, answeredQuestions: [] };
    
    gameHistory.saveGame(mockGameState1);
    gameHistory.saveGame(mockGameState2);
    
    const lastGame = gameHistory.getLastGame();
    
    expect(lastGame).toBe(mockGameState2);
  });

  test('should return null when getting last game with no completed games', () => {
    const lastGame = gameHistory.getLastGame();
    
    expect(lastGame).toBeNull();
  });
});