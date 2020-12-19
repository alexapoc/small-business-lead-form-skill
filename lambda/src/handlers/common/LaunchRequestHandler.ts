import { HandlerInput, RequestHandler, getRequestType, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class LaunchRequestHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'IntentRequest' && (getIntentName(requestEnvelope) === 'LaunchRequest');
    }

    handle(handlerInput: HandlerInput): Response {
        const responseBuilder = handlerInput.responseBuilder;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speak = requestAttributes.t('GREETING');
        const reprompt = requestAttributes.t('GREETING_REPROMPT');
        return responseBuilder.speak(speak).reprompt(reprompt).getResponse();
    }
}