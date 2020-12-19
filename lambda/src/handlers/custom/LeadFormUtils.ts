import { HandlerInput, getSlotValue } from "ask-sdk-core";
import  dateFormat from "dateformat";

import { LeadFormModel } from "../model/LeadFormModel";

export module LeadFormUtil {

    export async function saveLeadForm(handlerInput: HandlerInput): Promise<any> {
        const session = handlerInput.requestEnvelope.session;
        const leadFormModel: LeadFormModel = {
            //   sessionId: session.sessionId,
            //  applicationId: session.application.applicationId,
            //   userId: session.user.userId,
            locale: handlerInput.requestEnvelope.request.locale,
            createDateTime: dateFormat(new Date(), 'mm/dd/yyyy HH:MM:ss'),
            financingOption: getFinancingOption(getSlotValue(handlerInput.requestEnvelope, 'financingOption')),
            firstName: getSlotValue(handlerInput.requestEnvelope, 'firstName'),
            lastName: getSlotValue(handlerInput.requestEnvelope, 'lastName'),
            contactNumber: getSlotValue(handlerInput.requestEnvelope, 'contactNumber'),
            emailValue: getEmail(getSlotValue(handlerInput.requestEnvelope, 'emailAddress'))
        }

        const attributesManager = handlerInput.attributesManager;
        attributesManager.setPersistentAttributes(leadFormModel);
        await attributesManager.savePersistentAttributes();

        console.log("Data saved to dynamo DB == > " + JSON.stringify(leadFormModel));
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
        if (!email) {
            return email;
        }
        var atre = / at /gi;
        var dotre = / dot /gi;
        var newstr = email.replace(atre, "@");
        return newstr.replace(dotre, ".");
    }

    export function getYesNoSynonym(yesNoValue: string) {
        const opYes = ["Yes", "yes", "yep", "yup", "YES", "ya", "yeah", 'yea', 'sure'];
        if (opYes.includes(yesNoValue)) {
            return "Yes";
        } else
            return 'No';
    }

}