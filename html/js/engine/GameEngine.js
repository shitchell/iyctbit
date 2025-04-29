import { EraLoader } from './EraLoader.js';
import { GameState } from './GameState.js';
import { GameHistory } from './GameHistory.js';
import { evaluateChoiceCoherence } from './evaluateChoiceCoherence.js';

export class GameEngine {
    constructor(settings) {
        this.settings = settings;
        this.history = new GameHistory();
        this.currentEra = null;
        this.state = null;
    }

    async startNewGame() {
        console.log("Starting a new game session...");
        this.state = new GameState();
        this.currentEra = await EraLoader.loadEra('1500AD.json'); // hardcoded for now
        this.askCoreQuestions();
    }

    askCoreQuestions() {
        for (let i = 0; i < this.settings.numCoreQuestions; i++) {
            const question = this.currentEra.getRandomQuestion();
            this.askQuestion(question, 0);
        }
        this.endGame();
    }

    askQuestion(question, depth) {
        console.log(`\n${question.getText()}`);
        question.shuffleChoices();
        question.choices.forEach((choice, idx) => {
            console.log(`${idx + 1}: ${choice.getText()}`);
        });

        const userInput = prompt("Enter the number of your choice:");
        const selectedIndex = parseInt(userInput, 10) - 1;
        const selectedChoice = question.choices[selectedIndex];

        const coherenceScore = evaluateChoiceCoherence(selectedChoice, this.settings);
        this.state.recordAnsweredQuestion(question, selectedChoice, coherenceScore, depth);

        const allowBranch = this.shouldContinueRabbitHole(coherenceScore);
        if (allowBranch) {
            const followups = selectedChoice.answerObject.getFollowupQuestions();
            if (followups.length > 0) {
                console.log("Diving deeper into the rabbit hole...");
                followups.forEach(nextQuestion => this.askQuestion(nextQuestion, depth + 1));
            }
        }
    }

    shouldContinueRabbitHole(coherenceScore) {
        const requiredCoherence = this.settings.baseCoherenceFloor +
            (this.settings.coherenceRamp * this.state.rhDepth);
        return coherenceScore >= requiredCoherence;
    }

    endGame() {
        console.log("\n=== GAME OVER ===");
        console.log(`Final Score: ${this.state.calculateFinalScore(this.settings)}`);
        console.log(`Best Impact: ${this.state.getBestImpact()}`);
        console.log(`Worst Mistake: ${this.state.getWorstMistake()}`);
        this.history.saveGame(this.state);
    }
}
