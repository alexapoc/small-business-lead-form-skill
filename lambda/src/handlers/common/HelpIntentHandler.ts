import { HandlerInput, RequestHandler, getRequestType, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class HelpIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'IntentRequest' && getIntentName(requestEnvelope) === 'AMAZON.HelpIntent';
    }

    handle(handlerInput: HandlerInput): Response {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP');

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
    }
}