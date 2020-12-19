import { HandlerInput, RequestHandler, getRequestType, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class LastNameIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "lastName") !== null
            && getSlotValue(handlerInput.requestEnvelope, "contactNumber") === null
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('PHONE_INTENT'))
            .reprompt(requestAttributes.t('PHONE_INTENT'))
            .addElicitSlotDirective('contactNumber').getResponse();
    }
}