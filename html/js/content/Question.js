import { Choice } from './Choice.js';

export class Question {
    constructor(text, target, choices = []) {
        this.text = text;
        this.target = target;
        this.choices = choices;
    }

    getText() {
        if (this.text) {
            return this.text;
        } else if (this.target) {
            return `How would you create or explain: ${this.target.getText()}?`;
        } else {
            return "Unknown Question";
        }
    }

    shuffleChoices() {
        for (let i = this.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }
    }
}
