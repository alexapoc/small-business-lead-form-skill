import { HandlerInput, RequestHandler, getRequestType, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class LaunchRequestHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        //return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'LaunchRequest';
    }

    handle(handlerInput: HandlerInput): Response {
        const responseBuilder = handlerInput.responseBuilder;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('GREETING'))
            .reprompt(requestAttributes.t('GREETING_REPROMPT')).getResponse();
    }
}