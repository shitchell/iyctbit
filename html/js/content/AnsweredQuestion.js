export class AnsweredQuestion {
    constructor(question, selectedChoice, correct, depth) {
        this.question = question;
        this.selectedChoice = selectedChoice;
        this.correct = correct;
        this.depth = depth;
    }

    getPoints(settings) {
        const basePoints = 10;
        const depthBonus = this.depth * 5;
        const coherence = settings.includeCulturalCoherence
            ? this.selectedChoice.getCoherence()
            : this.selectedChoice.answerObject.getEnvironmentalCoherence();
        return (basePoints + depthBonus) * coherence;
    }

    getImpact() {
        return this.selectedChoice.answerObject.getImpactScore();
    }
}
