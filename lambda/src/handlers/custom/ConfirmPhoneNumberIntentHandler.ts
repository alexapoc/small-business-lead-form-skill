import { HandlerInput, RequestHandler, getRequestType, getSlotValue, getIntentName, getDialogState } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

//import PhoneValidator from "libphonenumber-js";
import { LeadFormUtil } from "../custom/LeadFormUtils";

export class ConfirmPhoneNumberIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "contactNumber") !== null
            && getSlotValue(handlerInput.requestEnvelope, "confirmContactNumber") !== null
            && handlerInput.attributesManager.getSessionAttributes().isConfirmCalled === true
            && getSlotValue(handlerInput.requestEnvelope, "yesNoOption") === null;
    }

    handle(handlerInput: HandlerInput): Response {
        const requestEnvelope = handlerInput.requestEnvelope;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (LeadFormUtil.getYesNoSynonym(getSlotValue(requestEnvelope, "confirmContactNumber")) === 'Yes') {
            //const isPhoneNumberValid = PhoneValidator.isValidNumber(request.intent.slots.contactNumber.value, 'US');
            const isPhoneNumberValid = true;
            if (isPhoneNumberValid) {
                return handlerInput.responseBuilder
                    .speak(requestAttributes.t('YES_NO_INTENT'))
                    .reprompt(requestAttributes.t('YES_NO_INTENT_REPROMPT'))
                    .addElicitSlotDirective('yesNoOption').getResponse();
            } else {
                sessionAttributes.isConfirmCalled = false;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                    .speak(requestAttributes.t('PHONE_INVALID'))
                    .reprompt(requestAttributes.t('PHONE_INVALID'))
                    .addElicitSlotDirective('contactNumber')
                    .getResponse();
            }
        } else {
            sessionAttributes.isConfirmCalled = false;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('PHONE_INTENT'))
                .reprompt(requestAttributes.t('PHONE_INTENT'))
                .addElicitSlotDirective('contactNumber').getResponse();
        }

    }
}