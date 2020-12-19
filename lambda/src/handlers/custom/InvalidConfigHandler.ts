import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

export class InvalidConfigHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): boolean {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        return attributes.invalidConfig || false;
    }
    handle(handlerInput: HandlerInput): Response {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder.speak(requestAttributes.t('ENV_NOT_CONFIGURED')).getResponse();
    }
}