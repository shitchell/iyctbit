import { AnsweredQuestion } from '../content/AnsweredQuestion.js';

export class GameState {
    constructor() {
        this.score = 0;
        this.rhDepth = 0;
        this.unsolvedComponents = [];
        this.currentTarget = null;
        this.answeredQuestions = [];
    }

    recordAnsweredQuestion(question, selectedChoice, coherenceScore, depth) {
        const isCorrect = selectedChoice.answerObject.getEnvironmentalCoherence() >= 0.8; // loose check
        this.answeredQuestions.push(new AnsweredQuestion(question, selectedChoice, isCorrect, depth));
        if (isCorrect) {
            this.rhDepth = Math.max(this.rhDepth, depth + 1);
        }
    }

    calculateFinalScore(settings) {
        let total = 0;
        for (const aq of this.answeredQuestions) {
            total += aq.getPoints(settings);
        }
        this.score = Math.round(total);
        return this.score;
    }

    getBestImpact() {
        if (this.answeredQuestions.length === 0) return "None";
        return this.answeredQuestions.reduce((best, aq) =>
            (aq.getImpact() > best.getImpact() ? aq : best)
        ).question.getText();
    }

    getWorstMistake() {
        if (this.answeredQuestions.length === 0) return "None";
        return this.answeredQuestions.reduce((worst, aq) =>
            (aq.getImpact() < worst.getImpact() ? aq : worst)
        ).question.getText();
    }
}
