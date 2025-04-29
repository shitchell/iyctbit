import { KnowledgeTransmission } from './KnowledgeTransmission.js';

export class KnowledgeIdea extends KnowledgeTransmission {
    constructor(props) {
        super(props);
    }

    getFollowupQuestions() {
        // For ideas, rabbit holes might explore underlying principles
        return [];
    }
}
