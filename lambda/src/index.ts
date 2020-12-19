import { HandlerInput, SkillBuilders } from "ask-sdk-core";
import { LambdaHandler } from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";

import { InvalidConfigHandler } from "./handlers/custom/InvalidConfigHandler";
import { CancelAndStopIntentHandler } from "./handlers/common/CancelAndStopIntentHandler";
import { HelpIntentHandler } from "./handlers/common/HelpIntentHandler";
import { LaunchRequestHandler } from "./handlers/common/LaunchRequestHandler";
import { InProgressLeadFormIntentHandler } from "./handlers/custom/InProgressLeadFormIntentHandler";
import { FinancingOptionIntentHandler } from "./handlers/custom/FinancingOptionIntentHandler";
import { FirstNameIntentHandler } from "./handlers/custom/FirstNameIntentHandler";
import { LastNameIntentHandler } from "./handlers/custom/LastNameIntentHandler";
import { PhoneNumberIntentHandler } from "./handlers/custom/PhoneNumberIntentHandler";
import { ConfirmPhoneNumberIntentHandler } from "./handlers/custom/ConfirmPhoneNumberIntentHandler";
import { YesNoOptionIntentHandler } from "./handlers/custom/YesNoOptionIntentHandler";
import { EmailIntentHandler } from "./handlers/custom/EmailIntentHandler";
import { LeadFormIntentHandler } from "./handlers/custom/LeadFormIntentHandler";
import { SessionEndedRequest } from "./handlers/common/SessionEndedRequest";

import { CustomErrorHandler } from "./handlers/common/CustomErrorHandler";

import { LocalizationInterceptor } from "./LocalizationInterceptor";
import AWS from "aws-sdk";
//import ddbAdapter from "ask-sdk-dynamodb-persistence-adapter";

import { PersistenceAdapter } from 'ask-sdk-core';
import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter';
import { config } from "dotenv";


// This function establishes the primary key of the database as the skill id (hence you get global persistence, not per user id)
function keyGenerator(handlerInput: HandlerInput) {
    if (handlerInput
        && handlerInput.requestEnvelope
        && handlerInput.requestEnvelope.context
        && handlerInput.requestEnvelope.context.System
        && handlerInput.requestEnvelope.context.System.application
        && handlerInput.requestEnvelope.context.System.application.applicationId) {
        return handlerInput.requestEnvelope.request.requestId;
    }
    throw 'Cannot retrieve app id from request envelope!';
}

function buildLambdaSkill(): LambdaHandler {

    return SkillBuilders.custom()
        .addRequestHandlers(
            new InvalidConfigHandler(),
            new CancelAndStopIntentHandler(),
            new HelpIntentHandler(),
            new LaunchRequestHandler(),
            new InProgressLeadFormIntentHandler(),
            new FinancingOptionIntentHandler(),
            new FirstNameIntentHandler(),
            new LastNameIntentHandler(),
            new PhoneNumberIntentHandler(),
            new ConfirmPhoneNumberIntentHandler(),
            new YesNoOptionIntentHandler(),
            new EmailIntentHandler(),
            new LeadFormIntentHandler(),
            new SessionEndedRequest()
        )
        .addErrorHandlers(new CustomErrorHandler())
        .addRequestInterceptors(new LocalizationInterceptor())
        .withPersistenceAdapter(new DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME || '',
            createTable: false,
     //       partitionKeyGenerator: keyGenerator || null,
            //dynamoDBClient: new AWS.DynamoDB({ apiVersion: 'latest', region: '' })
        })
        )
        .lambda();
}

export const handler = buildLambdaSkill();
