export class Settings {
    constructor({
        numCoreQuestions = 5,
        exitMidRabbitHole = true,
        includeCulturalCoherence = false,
        baseCoherenceFloor = 0.5,
        coherenceRamp = 0.05
    } = {}) {
        this.numCoreQuestions = numCoreQuestions;
        this.exitMidRabbitHole = exitMidRabbitHole;
        this.includeCulturalCoherence = includeCulturalCoherence;
        this.baseCoherenceFloor = baseCoherenceFloor;
        this.coherenceRamp = coherenceRamp;
    }
}
