import { HandlerInput, RequestHandler, getRequestType } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class SessionEndedRequest implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const requestEnvelope = handlerInput.requestEnvelope;
        return getRequestType(requestEnvelope) === 'SessionEndedRequest';
    }

    handle(handlerInput: HandlerInput): Response {
        console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
        const responseBuilder = handlerInput.responseBuilder;
        return responseBuilder.getResponse();
    }
}