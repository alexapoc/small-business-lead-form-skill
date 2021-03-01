import { SkillBuilders } from "ask-sdk-core";
import { LambdaHandler } from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";

import { InvalidConfigHandler } from "./handlers/custom/InvalidConfigHandler";
import { CancelAndStopIntentHandler } from "./handlers/common/CancelAndStopIntentHandler";
import { HelpIntentHandler } from "./handlers/common/HelpIntentHandler";
import { LaunchRequestHandler } from "./handlers/common/LaunchRequestHandler";
import { LeadFormIntentHandler } from "./handlers/custom/LeadFormIntentHandler";

import { SessionEndedRequest } from "./handlers/common/SessionEndedRequest";
import { CustomErrorHandler } from "./handlers/common/CustomErrorHandler";
import { LocalizationInterceptor } from "./LocalizationInterceptor";
import AWS from "aws-sdk";

import { DynamoDbPersistenceAdapter, } from 'ask-sdk-dynamodb-persistence-adapter';
import * as dotenv from "dotenv";
import { RequestEnvelope } from "ask-sdk-model";
dotenv.config();

// This function establishes the primary key of the database as the skill id (hence you get global persistence, not per user id)
function keyGenerator(requestEnvelope: RequestEnvelope): string {
    if (requestEnvelope?.session?.sessionId) {
        return requestEnvelope.session.sessionId;
    }
    throw 'Cannot retrieve app id from request envelope!';
}

function buildLambdaSkill(): LambdaHandler {

    const persistenceAdapter = new DynamoDbPersistenceAdapter({
        tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME!,
        createTable: false,
        partitionKeyGenerator: keyGenerator,
        dynamoDBClient: new AWS.DynamoDB(
            {
                apiVersion: 'latest',
                region: process.env.DYNAMODB_PERSISTENCE_REGION!
            }
        )
    });

    return SkillBuilders.custom()
        .addRequestHandlers(
            new InvalidConfigHandler(),
            new CancelAndStopIntentHandler(),
            new HelpIntentHandler(),
            new LaunchRequestHandler(),
            new LeadFormIntentHandler(),
            new SessionEndedRequest()
        )
        .addErrorHandlers(new CustomErrorHandler())
        .addRequestInterceptors(new LocalizationInterceptor())
        .withPersistenceAdapter(persistenceAdapter)
        .lambda();
}

export const handler = buildLambdaSkill();
