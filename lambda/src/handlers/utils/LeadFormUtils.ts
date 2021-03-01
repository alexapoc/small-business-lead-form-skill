import { HandlerInput, getSlotValue, getUserId, getLocale, getDeviceId } from "ask-sdk-core";
import { LeadFormModel } from "../model/LeadFormModel";
import { Logger } from "./Logger";

export module LeadFormUtils {

    export async function saveLeadForm(handlerInput: HandlerInput): Promise<any> {
        Logger.log("Inside saveLeadForm method .. ");

        const leadFormModel: LeadFormModel = {
            sessionId: handlerInput.requestEnvelope.session?.sessionId,
            applicationId: handlerInput.requestEnvelope.session?.application.applicationId,
            deviceId: getDeviceId(handlerInput.requestEnvelope),
            userId: getUserId(handlerInput.requestEnvelope),
            language: getLocale(handlerInput.requestEnvelope),
            financingOption: getFinancingOption(getSlotValue(handlerInput.requestEnvelope, 'financingOption')),
            firstName: getSlotValue(handlerInput.requestEnvelope, 'firstName'),
            lastName: getSlotValue(handlerInput.requestEnvelope, 'lastName'),
            contactNumber: getSlotValue(handlerInput.requestEnvelope, 'contactNumber'),
            emailValue: getEmail(getSlotValue(handlerInput.requestEnvelope, 'emailAddress')),
            leadFormDateTime: handlerInput.requestEnvelope.request.timestamp
        }

        Logger.debug("Lead form JSON == > " + JSON.stringify(leadFormModel));

        const attributesManager = handlerInput.attributesManager;
        attributesManager.setPersistentAttributes(leadFormModel);

        try {
            await attributesManager.savePersistentAttributes();
            Logger.log("Lead form data saved to dynamo DB");
        } catch (error) {
            Logger.error("Exception while saving lead form ==> " + JSON.stringify(error));
        }
    }

    export function getFinancingOption(financingOption: string) {
        const opOne = ["1", "one", "real state", "estate", "commercial real estate", "real estate", "commercial"];
        const opTwo = ["2", "two", "loans", "loan"];
        const opThree = ["3", "three", "credits", "credit", "lines of credits", "line of credits", "lines of credit", "line of credit"];

        if (opOne.includes(financingOption)) {
            return "Commercial Real Estate";
        }
        if (opTwo.includes(financingOption)) {
            return "Loans";
        }
        if (opThree.includes(financingOption)) {
            return "Lines of Credit";
        }
        return "";
    }

    export function getEmail(email: string) {
        if (!email) { return email; }
        var atre = / at /gi;
        var dotre = / dot /gi;
        var newstr = email.replace(atre, "@");
        return newstr.replace(dotre, ".");
    }

    export function getYesNoSynonym(yesNoValue: string) {
        const opYes = ["Yes", "yes", "yep", "yup", "YES", "ya", "yeah", 'yea', 'sure', 'why not', 'yes please'];
        if (opYes.includes(yesNoValue)) {
            return "Yes";
        } else { return 'No'; }
    }

}