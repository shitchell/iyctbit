/**
 * evaluateChoiceCoherence.js - Coherence calculation utility
 * 
 * This module provides a function to evaluate how coherent/valid a player's
 * choice is based on game settings. It can consider both environmental 
 * (factual) correctness and cultural acceptability.
 */

/**
 * Evaluates the coherence score of a player's choice
 * 
 * Determines whether to use combined coherence (environmental × cultural)
 * or just environmental coherence based on game settings.
 * 
 * This is a strategy pattern implementation that switches between two
 * different coherence evaluation strategies based on settings.
 * 
 * @param {Choice} choice - The player's selected choice
 * @param {Settings} settings - Game configuration settings
 * @returns {number} Coherence score between 0.0 and 1.0
 */
export function evaluateChoiceCoherence(choice, settings) {
    // If cultural coherence is enabled, use combined score
    // Otherwise, use only environmental (factual) coherence
    return settings.includeCulturalCoherence
        ? choice.getCoherence() // Combined score (environmental × cultural)
        : choice.answerObject.getEnvironmentalCoherence(); // Just factual correctness
}
