import { HandlerInput, RequestHandler, getRequestType, getSlotValue, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { LeadFormUtil } from "./LeadFormUtils";

export class YesNoOptionIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const yesNoValue = LeadFormUtil.getYesNoSynonym(getSlotValue(handlerInput.requestEnvelope, "yesNoOption"));
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "yesNoOption") !== null
            && yesNoValue === 'Yes'
            && getSlotValue(handlerInput.requestEnvelope, "emailAddress") === null
    }

    handle(handlerInput: HandlerInput): Response {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('EMAIL_ADDRESS'))
            .reprompt(requestAttributes.t('EMAIL_ADDRESS_REPROMPT'))
            .addElicitSlotDirective('emailAddress').getResponse();
    }
}