import { HandlerInput, RequestInterceptor, getLocale } from "ask-sdk-core";
import { languageStrings } from "./languages/languageStrings";
import i18next from "i18next";
import sprintf from "i18next-sprintf-postprocessor";

type TranslationFunction = (...args: any[]) => string;

// This interceptor function is used for localization.
// It uses the i18n module, along with defined language
// string to return localized content. It defaults to 'en'
// if it can't find a matching language.
export class LocalizationInterceptor implements RequestInterceptor {
    async process(handlerInput: HandlerInput) {
        
        const localizationClient = await i18next.use(sprintf).init({
            lng: getLocale(handlerInput.requestEnvelope),
            fallbackLng: 'en-US',
            resources: languageStrings,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
       //     returnObjects: true,
        });

        // const attributes = handlerInput.attributesManager.getRequestAttributes();
        // attributes.t = function (...args: any[]) {
        //     return (localizationClient..t as TranslationFunction)(...args);
        // };
        // attributes.tr = function (key: any) {
        //     const result = localizationClient.t(key) as string[];
        //     return Random(result);
        // };
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (args: any) => localizationClient(args);
    }
}

export function Random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
