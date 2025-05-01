/**
 * GameState.js - Session state management
 * 
 * Tracks the current state of a game session, including:
 * - Player score and progression
 * - Answered questions and choices
 * - Rabbit hole depth
 * - Components being tracked
 * 
 * Used by GameEngine to maintain the current game state and calculate
 * final results when the game concludes.
 */

import { AnsweredQuestion } from '../content/AnsweredQuestion.js';

/**
 * GameState - Manages the state of a single game session
 * 
 * Responsible for tracking player progress, recording answers,
 * and calculating final results.
 */
export class GameState {
    /**
     * Creates a new game state with default values
     */
    constructor() {
        /**
         * Current game score
         * @type {number}
         */
        this.score = 0;
        
        /**
         * Current depth in rabbit hole exploration
         * Increases as player provides correct answers to deeper questions
         * @type {number}
         */
        this.rhDepth = 0;
        
        /**
         * Components that haven't been solved yet
         * Used for tracking technology recipes that need resolution
         * @type {string[]}
         */
        this.unsolvedComponents = [];
        
        /**
         * Current target object being addressed
         * Typically a technology or knowledge idea being questioned about
         * @type {KnowledgeTransmission|null}
         */
        this.currentTarget = null;
        
        /**
         * Record of all questions answered during this session
         * @type {AnsweredQuestion[]}
         */
        this.answeredQuestions = [];
    }

    /**
     * Records a player's answer to a question
     * 
     * Stores the question, selected choice, and related metadata.
     * Updates rabbit hole depth if the answer was correct.
     * 
     * @param {Question} question - The question that was asked
     * @param {Choice} selectedChoice - The choice the player selected
     * @param {number} coherenceScore - The calculated coherence score
     * @param {number} depth - The depth at which this question was asked
     */
    recordAnsweredQuestion(question, selectedChoice, coherenceScore, depth) {
        // Consider anything with environmental coherence >= 0.8 as "correct"
        // Note: This threshold is currently hardcoded and could be moved to Settings
        const isCorrect = selectedChoice.answerObject.getEnvironmentalCoherence() >= 0.8;
        
        // Create and store an AnsweredQuestion record
        this.answeredQuestions.push(new AnsweredQuestion(question, selectedChoice, isCorrect, depth));
        
        // If correct, update the maximum rabbit hole depth
        if (isCorrect) {
            this.rhDepth = Math.max(this.rhDepth, depth + 1);
        }
    }

    /**
     * Calculates the final score based on all answered questions
     * 
     * Iterates through all answered questions, accumulates points,
     * and returns the rounded total score.
     * 
     * @param {Settings} settings - Game settings used for scoring calculations
     * @returns {number} The final rounded score
     */
    calculateFinalScore(settings) {
        let total = 0;
        
        // Sum points from all answered questions
        for (const aq of this.answeredQuestions) {
            total += aq.getPoints(settings);
        }
        
        // Round and store the final score
        this.score = Math.round(total);
        return this.score;
    }

    /**
     * Identifies the question with the highest positive impact
     * 
     * Finds the question where the player's answer had the greatest
     * positive effect on the world.
     * 
     * @returns {string} Text of the question with best impact, or "None"
     */
    getBestImpact() {
        if (this.answeredQuestions.length === 0) return "None";
        
        // Find the answer with the highest impact score
        return this.answeredQuestions.reduce((best, aq) =>
            (aq.getImpact() > best.getImpact() ? aq : best)
        ).question.getText();
    }

    /**
     * Identifies the question with the lowest (worst) impact
     * 
     * Finds the question where the player's answer had the least
     * beneficial or most negative effect on the world.
     * 
     * @returns {string} Text of the question with worst impact, or "None"
     */
    getWorstMistake() {
        if (this.answeredQuestions.length === 0) return "None";
        
        // Find the answer with the lowest impact score
        return this.answeredQuestions.reduce((worst, aq) =>
            (aq.getImpact() < worst.getImpact() ? aq : worst)
        ).question.getText();
    }
}
