import { HandlerInput, RequestHandler, getRequestType, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { LeadFormUtil } from "../custom/LeadFormUtils";
import EmailValidator from "email-validator";

export class EmailIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "yesNoOption") != null
            && LeadFormUtil.getYesNoSynonym(getSlotValue(handlerInput.requestEnvelope, "yesNoOption")) === 'Yes'
            && getSlotValue(handlerInput.requestEnvelope, "emailAddress") != null
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request;
        const email = LeadFormUtil.getEmail(getSlotValue(handlerInput.requestEnvelope, "emailAddress"));
        const isValid = EmailValidator.validate(email);
        if (isValid) {
            LeadFormUtil.saveLeadForm(handlerInput)
            const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
            const responseBuilder = handlerInput.responseBuilder;
            return responseBuilder
                .speak(requestAttributes.t('LEAD_FORM_CONFIRM'))
                .withShouldEndSession(true).getResponse();
        } else {
            const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('INVALID_EMAIL_ADDRESS'))
                .reprompt(requestAttributes.t('INVALID_EMAIL_ADDRESS_REPROMPT'))
                .addElicitSlotDirective('emailAddress').getResponse();
        }
    }
}