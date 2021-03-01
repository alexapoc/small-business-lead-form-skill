import { HandlerInput, ErrorHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class CustomErrorHandler implements ErrorHandler {
    canHandle(): boolean {
        return true;
    }
    handle(handlerInput: HandlerInput, error: Error): Response {
        const request = handlerInput.requestEnvelope.request;
        console.log("In errorHandler- handle(): Request Obj is: " + JSON.stringify(request));
        console.log(`In errorHandler- handle() Error Trace: ${error.message}`);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR'))
            .reprompt(requestAttributes.t('ERROR'))
            .withShouldEndSession(true).getResponse();
    }
}