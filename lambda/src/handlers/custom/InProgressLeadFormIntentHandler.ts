import { HandlerInput, RequestHandler, getRequestType, getIntentName, getDialogState } from "ask-sdk-core";
import { IntentRequest, Request, Response } from "ask-sdk-model";

export class InProgressLeadFormIntentHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'IntentRequest'
            && getIntentName(requestEnvelope) === 'SmallBusinessLeadFormIntent'
            && getDialogState(requestEnvelope) !== 'COMPLETED';
    }

    handle(handlerInput: HandlerInput): Response {
        const request = handlerInput.requestEnvelope.request as IntentRequest;

        const currentIntent = request.intent;
        return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
    }
}