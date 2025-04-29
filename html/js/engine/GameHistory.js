export class GameHistory {
    constructor() {
        this.completedGames = [];
    }

    saveGame(gameState) {
        this.completedGames.push(gameState);
    }

    getLastGame() {
        if (this.completedGames.length === 0) return null;
        return this.completedGames[this.completedGames.length - 1];
    }
}
