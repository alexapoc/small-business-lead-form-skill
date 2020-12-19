import { HandlerInput, RequestHandler, getRequestType, getIntentName, getDialogState } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { LeadFormUtil } from "../custom/LeadFormUtils";

export class LeadFormIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'IntentRequest'
            && getIntentName(requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getDialogState(requestEnvelope) === "COMPLETED";
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        LeadFormUtil.saveLeadForm(handlerInput);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const responseBuilder = handlerInput.responseBuilder;
        return responseBuilder.speak(requestAttributes.t('LEAD_FORM_CONFIRM')).withShouldEndSession(true).getResponse();
    }

}