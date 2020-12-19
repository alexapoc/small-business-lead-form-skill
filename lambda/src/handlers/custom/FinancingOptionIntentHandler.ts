import { HandlerInput, RequestHandler, getRequestType, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { LeadFormUtil } from "./LeadFormUtils";

export class FinancingOptionIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && getIntentName(handlerInput.requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getSlotValue(handlerInput.requestEnvelope, "financingOption") !== null
            && getSlotValue(handlerInput.requestEnvelope, "firstName") === null
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        const financingValue = LeadFormUtil.getFinancingOption(getSlotValue(handlerInput.requestEnvelope, "financingOption"));
        if (financingValue === "Commercial Real Estate" || financingValue === 'Loans' || financingValue === 'Lines of Credit') {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('FIRST_NAME_INTENT', financingValue))
                .reprompt(requestAttributes.t('FIRST_NAME_INTENT', financingValue))
                .addElicitSlotDirective('firstName').getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('FINANCING_OPTION_INVALID'))
                .reprompt(requestAttributes.t('FINANCING_OPTION_INVALID'))
                .addElicitSlotDirective('financingOption').getResponse();
        }
    }
}