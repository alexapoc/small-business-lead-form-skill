import { HandlerInput, RequestHandler, getRequestType, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class CancelAndStopIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope
        return getRequestType(requestEnvelope) === 'IntentRequest'
            && (getIntentName(requestEnvelope) === 'AMAZON.CancelIntent' || getIntentName(requestEnvelope) === 'AMAZON.StopIntent');
    }

    handle(handlerInput: HandlerInput): Response {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('CANCEL_STOP_RESPONSE')).getResponse();
    }
}