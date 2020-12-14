const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const Alexa = require('ask-sdk-core');
const dateFormat = require('dateformat');
const EmailValidator = require('email-validator');
const AWS = require('aws-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

require("dotenv").config();

/* LANGUAGE STRINGS */
const languageStrings = require('./languages/languageStrings');

const InvalidConfigHandler = {
    canHandle(handlerInput) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        return attributes.invalidConfig || false;
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder.speak(requestAttributes.t('ENV_NOT_CONFIGURED')).getResponse();
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GREETING');
        return responseBuilder
            .speak(speakOutput).reprompt(requestAttributes.t('GREETING_REPROMPT')).getResponse();
    },
};

const InProgressLeadFormIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'SmallBusinessLeadFormIntent'
            && request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
    },
};

const YesNoOptionIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'SmallBusinessLeadFormIntent'
            && request.intent.slots.yesNoOption.value
            && (request.intent.slots.yesNoOption.value === 'yes' || request.intent.slots.yesNoOption.value === 'Yes')
            && !request.intent.slots.emailAddress.value
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('EMAIL_ADDRESS'))
            .reprompt(requestAttributes.t('EMAIL_ADDRESS_REPROMPT'))
            .addElicitSlotDirective('emailAddress').getResponse();
    },
};

const EmailIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'SmallBusinessLeadFormIntent' &&
            request.intent.slots.yesNoOption.value
            && (request.intent.slots.yesNoOption.value === 'yes' || request.intent.slots.yesNoOption.value === 'Yes')
            && request.intent.slots.emailAddress.value
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const email = getEmail(request.intent.slots.emailAddress.value);
        const isValid = EmailValidator.validate(email);

        if (isValid) {
            saveLeadForm(handlerInput)

            const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
            const responseBuilder = handlerInput.responseBuilder;
            return responseBuilder.speak(requestAttributes.t('LEAD_FORM_CONFIRM')).withShouldEndSession(true).getResponse();
        } else {
            const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('INVALID_EMAIL_ADDRESS'))
                .reprompt(requestAttributes.t('INVALID_EMAIL_ADDRESS_REPROMPT'))
                .addElicitSlotDirective('emailAddress')
                .getResponse();
        }
    },
};

async function saveLeadForm(handlerInput) {

    const session = handlerInput.requestEnvelope.session;
    const leadForm = {
        sessionId: session.sessionId,
        applicationId: session.application.applicationId,
        userId: session.user.userId,
        locale: handlerInput.requestEnvelope.request.locale,
        createDateTime: dateFormat(new Date(), 'mm/dd/yyyy HH:MM:ss'),
        financingOption: getFinancingOption(Alexa.getSlotValue(handlerInput.requestEnvelope, 'financingOption')),
        firstName: Alexa.getSlotValue(handlerInput.requestEnvelope, 'firstName'),
        lastName: Alexa.getSlotValue(handlerInput.requestEnvelope, 'lastName'),
        contactNumber: Alexa.getSlotValue(handlerInput.requestEnvelope, 'contactNumber'),
        emailAddress: getEmail(Alexa.getSlotValue(handlerInput.requestEnvelope, 'emailAddress'))
    }

    console.log("Lead form to be saved ==> " + JSON.stringify(leadForm));

    const attributesManager = handlerInput.attributesManager;

    attributesManager.setPersistentAttributes(leadForm);
    await attributesManager.savePersistentAttributes();

    console.log("Saved to dynamo DB == > " + JSON.stringify(leadForm));
}

const LeadFormIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'SmallBusinessLeadFormIntent'
            && request.dialogState === "COMPLETED";
    },
    async handle(handlerInput) {
        saveLeadForm(handlerInput);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const responseBuilder = handlerInput.responseBuilder;
        return responseBuilder.speak(requestAttributes.t('LEAD_FORM_CONFIRM')).withShouldEndSession(true).getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say tell me';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;
        const errMessage = request.type + '--' + request.intent.name + '--' + request.dialogState;
        console.log("error==> " + errMessage);
        console.log(`Error handled: ${error.message}`);
        //const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        // return handlerInput.responseBuilder
        //     .speak(requestAttributes.t('ERROR'))
        //     .reprompt(requestAttributes.t('ERROR_REPROMPT'))
        //     .getResponse();

        const speech = 'There is an error while processing your request';
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(speech)
            .getResponse();
    },
};

function getFinancingOption(financingOption) {
    const opOne = ["1", "one", "real state", "estate", "commercial real estate", "real estate", "commercial"];
    const opTwo = ["2", "two", "loans", "loan"];
    const opThree = ["3", "three", "credits", "credit", "lines of credits", "line of credits", "lines of credit", "line of credit"];

    if (opOne.includes(financingOption)) {
        return "Commercial Real Estate";
    } if (opTwo.includes(financingOption)) {
        return "Loans";
    } if (opThree.includes(financingOption)) {
        return "Lines of Credit";
    } else {
        return null;
    }
}

function getEmail(email) {
    if (email === null || email === 'undefined') {
        return null;
    }
    var atre = / at /gi;
    var dotre = / dot /gi;
    var newstr = email.replace(atre, "@");
    return newstr.replace(dotre, ".");
}

// This interceptor function is used for localization.
// It uses the i18n module, along with defined language
// string to return localized content. It defaults to 'en'
// if it can't find a matching language.
const LocalizationInterceptor = {
    process(handlerInput) {
        const { requestEnvelope, attributesManager } = handlerInput;

        const localizationClient = i18n.use(sprintf).init({
            lng: requestEnvelope.request.locale,
            fallbackLng: 'en-US',
            resources: languageStrings,
        });

        localizationClient.localize = (...args) => {
            // const args = arguments;
            const values = [];

            for (let i = 1; i < args.length; i += 1) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values,
            });

            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };

        const attributes = attributesManager.getRequestAttributes();
        attributes.t = (...args) => localizationClient.localize(...args);
    },
};

// This function establishes the primary key of the database as the skill id (hence you get global persistence, not per user id)
function keyGenerator(requestEnvelope) {
    if (requestEnvelope
        && requestEnvelope.context
        && requestEnvelope.context.System
        && requestEnvelope.context.System.application
        && requestEnvelope.context.System.application.applicationId) {
        return requestEnvelope.request.requestId;
    }
    throw 'Cannot retrieve app id from request envelope!';
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        InvalidConfigHandler,
        LaunchRequestHandler,
        InProgressLeadFormIntentHandler,
        YesNoOptionIntentHandler,
        EmailIntentHandler,
        LeadFormIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addRequestInterceptors(
        LocalizationInterceptor
    )
    .addErrorHandlers(ErrorHandler)
    .withPersistenceAdapter(
        new ddbAdapter.DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
            createTable: false,
            partitionKeyGenerator: keyGenerator,
            dynamoDBClient: new AWS.DynamoDB({ apiVersion: 'latest', region: process.env.DYNAMODB_PERSISTENCE_REGION })
        })
    )
    .lambda();