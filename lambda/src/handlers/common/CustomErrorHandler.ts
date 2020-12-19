import { HandlerInput, ErrorHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class CustomErrorHandler implements ErrorHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        return true;
    }
    handle(handlerInput: HandlerInput, error: Error): Response {
        const request = handlerInput.requestEnvelope.request;
        console.log("In errorHandler- handle(): RequestType is: " + JSON.stringify(request));
        console.log(`In errorHandler- handle() Error Trace: ${error.message}`);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP');
        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withShouldEndSession(true).getResponse();
    }
}