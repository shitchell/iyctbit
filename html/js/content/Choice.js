export class Choice {
    constructor({ customText = null, customSuccessResponse = null, customFailureResponse = null, answerObject = null }) {
        this.customText = customText;
        this.customSuccessResponse = customSuccessResponse;
        this.customFailureResponse = customFailureResponse;
        this.answerObject = answerObject;
    }

    getText() {
        return this.customText || this.answerObject.getText();
    }

    getSuccessResponse() {
        return this.customSuccessResponse || this.answerObject.getSuccessResponse();
    }

    getFailureResponse() {
        return this.customFailureResponse || this.answerObject.getFailureResponse();
    }

    getCoherence() {
        return this.answerObject.getCoherence();
    }
}
