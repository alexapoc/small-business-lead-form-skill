import { AttributesManager } from "ask-sdk-core";
import { Logger } from "../utils/Logger";
import sgMail from "@sendgrid/mail";

export module SendMail {

    export async function send(
        attributesManager: AttributesManager, toMail: string, firstName: string, contactNumber: string) {

        const requestAttributes = attributesManager.getRequestAttributes();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        sgMail.send({
            from: process.env.FROM_EMAIL!,
            to: toMail,
            subject: requestAttributes.t('EMAIL_SUBJECT', firstName),
            text: requestAttributes.t('EMAIL_BODY', firstName, contactNumber)
            //html: requestAttributes.t('LAST_NAME_INTENT', firstName)
        }).then(result => {
            Logger.debug('Email sent to ' + toMail)
        }, err => {
            Logger.error("Failed to send email to " + toMail + " error: " + err)
        });

    }
}