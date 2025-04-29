import { KnowledgeTransmission } from './KnowledgeTransmission.js';

export class Technology extends KnowledgeTransmission {
    constructor(props, recipes = []) {
        super(props);
        this.recipes = recipes; // array of arrays of components
    }

    getFollowupQuestions() {
        // Rabbit hole logic: spawn questions about crafting components
        return this.recipes.flatMap(recipe =>
            recipe.map(componentName => ({
                getText: () => `How would you create: ${componentName}?`,
                choices: [] // Would be generated dynamically
            }))
        );
    }
}
