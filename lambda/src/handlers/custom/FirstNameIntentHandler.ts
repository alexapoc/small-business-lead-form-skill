import { HandlerInput, RequestHandler, getRequestType, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class FirstNameIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "firstName") !== null
            && getSlotValue(handlerInput.requestEnvelope, "lastName") === null
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('LAST_NAME_INTENT', getSlotValue(handlerInput.requestEnvelope, "firstName")))
            .reprompt(requestAttributes.t('LAST_NAME_INTENT', getSlotValue(handlerInput.requestEnvelope, "firstName")))
            .addElicitSlotDirective('lastName').getResponse();
    }
}