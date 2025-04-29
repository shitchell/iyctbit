export class KnowledgeTransmission {
    constructor({ text, yearIntroduced, environmentalCoherence, culturalCoherence, impactScore }) {
        this.text = text;
        this.yearIntroduced = yearIntroduced;
        this.environmentalCoherence = environmentalCoherence;
        this.culturalCoherence = culturalCoherence;
        this.impactScore = impactScore;
    }

    getText() {
        return this.text;
    }

    getYearIntroduced() {
        return this.yearIntroduced;
    }

    getEnvironmentalCoherence() {
        return this.environmentalCoherence;
    }

    getCulturalCoherence() {
        return this.culturalCoherence;
    }

    getCoherence() {
        return this.environmentalCoherence * this.culturalCoherence;
    }

    getImpactScore() {
        return this.impactScore;
    }

    getSuccessResponse() {
        return "Your knowledge spreads and changes the world!";
    }

    getFailureResponse() {
        return "Your ideas fall on deaf ears...";
    }

    getCorrectChoices() {
        return []; // To be overridden by subclasses if needed
    }
}
