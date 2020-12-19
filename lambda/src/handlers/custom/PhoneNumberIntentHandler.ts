import { HandlerInput, RequestHandler, getRequestType, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class PhoneNumberIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "contactNumber") !== null
            && getSlotValue(handlerInput.requestEnvelope, "yesNoOption") === null
            && (!handlerInput.attributesManager.getSessionAttributes().isConfirmCalled || (handlerInput.attributesManager.getSessionAttributes().isConfirmCalled === false))
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (isNaN(Number(getSlotValue(handlerInput.requestEnvelope, "contactNumber")))) {
            sessionAttributes.isConfirmCalled = false;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('PHONE_INVALID'))
                .reprompt(requestAttributes.t('PHONE_INVALID'))
                .addElicitSlotDirective('contactNumber').getResponse();
        } else {
            sessionAttributes.isConfirmCalled = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('PHONE_CONFIRM_INTENT', getSlotValue(handlerInput.requestEnvelope, "contactNumber")))
                .reprompt(requestAttributes.t('PHONE_CONFIRM_INTENT', getSlotValue(handlerInput.requestEnvelope, "contactNumber")))
                .addElicitSlotDirective('confirmContactNumber').getResponse();
        }
    }
}