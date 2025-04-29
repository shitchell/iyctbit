export function evaluateChoiceCoherence(choice, settings) {
    return settings.includeCulturalCoherence
        ? choice.getCoherence()
        : choice.answerObject.getEnvironmentalCoherence();
}
