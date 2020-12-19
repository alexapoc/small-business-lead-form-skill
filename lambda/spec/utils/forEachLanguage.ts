import {languageString} from "../../src/resourceStrings";

export function forEachLanguageInResources(delegate : (language : string) => void) {
    Object
        .keys(languageString)
        .forEach((language) => delegate(language));
};