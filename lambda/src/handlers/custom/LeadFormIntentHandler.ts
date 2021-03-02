import { HandlerInput, RequestHandler, getRequestType, getSlotValue, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import EmailValidator from "email-validator";
import { parse, isValidNumber } from "libphonenumber-js";
import { LeadFormUtils } from "../utils/LeadFormUtils";
import { Logger } from "../utils/Logger";
import { SendMail } from "../utils/SendMail";

export class LeadFormIntentHandler implements RequestHandler {

    canHandle(handlerInput: HandlerInput): boolean {
        Logger.log("Inside LeadFormIntentHandler canHandle()");
        const envelope = handlerInput.requestEnvelope;
        return getRequestType(envelope) === 'IntentRequest'
            && getIntentName(envelope) === 'SmallBusinessLeadFormIntent';
    }

    handle(handlerInput: HandlerInput): Response {
        Logger.log("Inside LeadFormIntentHandler handle()")
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const envelope = handlerInput.requestEnvelope;

        // Financing Option slot
        const firstName = getSlotValue(envelope, "firstName");
        if (getSlotValue(envelope, "financingOption") !== null && !firstName) {
            Logger.debug("Processing financingOption slot");
            return financingOptionSlot(handlerInput);
        }

        // First Name slot
        const lastName = getSlotValue(envelope, "lastName");
        if (firstName !== null && !lastName) {
            Logger.debug("Processing firstName slot");
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('LAST_NAME_INTENT', firstName))
                .reprompt(requestAttributes.t('LAST_NAME_INTENT', firstName))
                .addElicitSlotDirective('lastName').getResponse();
        }

        // Last Name slot
        const contactNumber = getSlotValue(envelope, "contactNumber")
        if (lastName !== null && !contactNumber) {
            Logger.debug("Processing lastName slot");
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('PHONE_INTENT'))
                .reprompt(requestAttributes.t('PHONE_INTENT'))
                .addElicitSlotDirective('contactNumber').getResponse();
        }

        // Contact Number slot
        const emailYesNoOption = getSlotValue(envelope, "yesNoOption");
        let isConfirmCalled = (!sessionAttributes.isConfirmCalled || (sessionAttributes.isConfirmCalled === false));
        if (contactNumber !== null && !emailYesNoOption && isConfirmCalled) {
            Logger.debug("Processing contactNumber slot");
            return contactNumberSlot(handlerInput);
        }

        // Confirm Contact Nubmer
        isConfirmCalled = (sessionAttributes.isConfirmCalled === true);
        if (contactNumber !== null && getSlotValue(envelope, "confirmContactNumber") !== null && isConfirmCalled && !emailYesNoOption) {
            Logger.debug("Processing confirmContactNumber slot");
            return confirmContactNumber(handlerInput);
        }

        // Email YesNo slot
        const email = getSlotValue(envelope, "emailAddress");
        const emailYesNoValue = LeadFormUtils.getYesNoSynonym(emailYesNoOption);
        if (emailYesNoOption !== null && emailYesNoValue === 'Yes' && !email) {
            Logger.debug("Processing emailYesNoOption slot");
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('EMAIL_ADDRESS'))
                .reprompt(requestAttributes.t('EMAIL_ADDRESS_REPROMPT'))
                .addElicitSlotDirective('emailAddress').getResponse();
        }

        // Email Validation
        if (emailYesNoValue != null && emailYesNoValue === 'Yes' && email !== null) {
            Logger.debug("Processing email slot and handling saveLeadFormIfValidEmail method");
            return saveLeadFormIfValidEmail(handlerInput);
        }

        Logger.log("Saving lead form without email address");
        LeadFormUtils.saveLeadForm(handlerInput);

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('LEAD_FORM_CONFIRM'))
            .withShouldEndSession(true)
            .getResponse();
    }
}

function financingOptionSlot(handlerInput: HandlerInput): Response {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const envelope = handlerInput.requestEnvelope;
    const finOption = getSlotValue(envelope, "financingOption");
    const financingValue = LeadFormUtils.getFinancingOption(finOption);
    Logger.debug("Financing option received ==> " + finOption + " and converted into ==> " + financingValue);

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

function contactNumberSlot(handlerInput: HandlerInput): Response {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const envelope = handlerInput.requestEnvelope;
    const contactNumber = getSlotValue(envelope, "contactNumber");
    Logger.debug("contactContactNumber ==> " + contactNumber)

    if (isNaN(Number(contactNumber))) {
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
            .speak(requestAttributes.t('PHONE_CONFIRM_INTENT', contactNumber))
            .reprompt(requestAttributes.t('PHONE_CONFIRM_INTENT', contactNumber))
            .addElicitSlotDirective('confirmContactNumber').getResponse();
    }
}

function confirmContactNumber(handlerInput: HandlerInput): Response {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const envelope = handlerInput.requestEnvelope;
    const confirmContactNumber = getSlotValue(envelope, "confirmContactNumber");
    Logger.debug("confirmContactNumber ==> " + confirmContactNumber)

    if (LeadFormUtils.getYesNoSynonym(confirmContactNumber) === 'Yes') {
        const contactNumber = getSlotValue(envelope, "contactNumber");
        const isPhoneNumberValid = isValidNumber(parse(contactNumber, "US"));
        Logger.debug("contactNumber ==> " + contactNumber + " and isPhoneNumberValid ==> " + isPhoneNumberValid);

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

/**
 * Save the Lead form if the email address is valid. 
 * If not valid then prompt the user about invalid email and ask for email address again.
 * @param handlerInput 
 */
function saveLeadFormIfValidEmail(handlerInput: HandlerInput): Response {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const envelope = handlerInput.requestEnvelope;

    let email = getSlotValue(envelope, "emailAddress");
    Logger.debug("raw email input from alexa ==> " + email);
    email = LeadFormUtils.getEmail(email).replace(/\s/g, '');

    const isValid = EmailValidator.validate(email);
    Logger.debug("email ==> " + email + " and isValid ==> " + isValid);

    if (isValid) {
        Logger.log("Saving lead form with email address");
        LeadFormUtils.saveLeadForm(handlerInput);

        SendMail.send(handlerInput.attributesManager, email, getSlotValue(envelope, "firstName"), getSlotValue(envelope, "contactNumber"));

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('LEAD_FORM_CONFIRM'))
            .withShouldEndSession(true).getResponse();
    } else {
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('INVALID_EMAIL_ADDRESS'))
            .reprompt(requestAttributes.t('INVALID_EMAIL_ADDRESS_REPROMPT'))
            .addElicitSlotDirective('emailAddress').getResponse();
    }
}

