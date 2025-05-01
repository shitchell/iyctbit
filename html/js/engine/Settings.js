/**
 * Settings.js - Game configuration module
 * 
 * Provides a centralized class for managing game settings and parameters.
 * Used by GameEngine and other components to control game behavior.
 */

/**
 * Settings - Configuration class for game parameters
 * 
 * Manages all adjustable parameters that affect gameplay, including:
 * - Question counts
 * - Coherence thresholds
 * - Game mode options
 */
export class Settings {
    /**
     * Creates a new Settings object with specified parameters
     * 
     * @param {Object} options - Configuration options
     * @param {number} [options.numCoreQuestions=5] - Number of primary questions to ask
     * @param {boolean} [options.exitMidRabbitHole=true] - Whether rabbit holes end when core questions are done
     * @param {boolean} [options.includeCulturalCoherence=false] - Whether to factor in cultural acceptance
     * @param {number} [options.baseCoherenceFloor=0.5] - Minimum coherence score required for basic questions
     * @param {number} [options.coherenceRamp=0.05] - How much coherence requirement increases per depth level
     */
    constructor({
        numCoreQuestions = 5,
        exitMidRabbitHole = true,
        includeCulturalCoherence = false,
        baseCoherenceFloor = 0.5,
        coherenceRamp = 0.05
    } = {}) {
        /**
         * Number of primary questions to ask the player
         * @type {number}
         */
        this.numCoreQuestions = numCoreQuestions;
        
        /**
         * Whether rabbit hole exploration ends when core questions are complete
         * If true, no more rabbit hole questions after all core questions are answered
         * If false, player can continue exploring rabbit holes until natural conclusion
         * @type {boolean}
         */
        this.exitMidRabbitHole = exitMidRabbitHole;
        
        /**
         * Whether to factor in cultural coherence in addition to environmental coherence
         * If true, answers are evaluated based on both historical accuracy and cultural acceptance
         * If false, only objective accuracy is considered
         * @type {boolean}
         */
        this.includeCulturalCoherence = includeCulturalCoherence;
        
        /**
         * Minimum coherence score required for the first level of rabbit hole questions
         * Higher values make the game more strict about accepting answers
         * @type {number}
         */
        this.baseCoherenceFloor = baseCoherenceFloor;
        
        /**
         * How much the coherence requirement increases per rabbit hole depth level
         * Higher values make deeper levels progressively more difficult
         * @type {number}
         */
        this.coherenceRamp = coherenceRamp;
    }
}
