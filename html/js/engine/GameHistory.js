/**
 * GameHistory.js - Game session history storage
 * 
 * Provides storage and retrieval of completed game sessions.
 * Acts as a repository pattern implementation for past games.
 */

/**
 * GameHistory - Keeps track of completed game sessions
 * 
 * Stores GameState objects from completed games to allow
 * for reviewing past games, analyzing performance, or
 * potentially resuming games in the future.
 */
export class GameHistory {
    /**
     * Creates a new game history object
     */
    constructor() {
        /**
         * List of completed game states
         * @type {GameState[]}
         */
        this.completedGames = [];
    }

    /**
     * Saves a completed game state to history
     * 
     * @param {GameState} gameState - The game state to save
     */
    saveGame(gameState) {
        this.completedGames.push(gameState);
    }

    /**
     * Retrieves the most recently completed game
     * 
     * @returns {GameState|null} The most recent game or null if none exist
     */
    getLastGame() {
        if (this.completedGames.length === 0) return null;
        return this.completedGames[this.completedGames.length - 1];
    }
}
